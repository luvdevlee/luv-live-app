import {
  Injectable,
  UnauthorizedException,
  Logger,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { LoginInput } from '@src/auth/dto/login.input';
import { CreateUserDto } from '@src/user/dto/create-user.dto';
import { User as UserSchema } from '@src/user/schemas/user.schema';
import { AuthResponse } from '@src/auth/dto/auth.response';
import { GoogleProfile } from './strategies/google.strategy';
import { environmentVariablesConfig } from '@src/config/app.config';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    try {
      this.logger.log(`Attempting to register user: ${createUserDto.email}`);

      // Validate input
      if (!createUserDto.email || !createUserDto.password) {
        throw new BadRequestException('Email and password are required');
      }

      // Create user
      const user = await this.userService.create(createUserDto);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User registered successfully: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`User registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      this.logger.log(`Attempting login for: ${loginInput.email}`);

      // Validate input
      if (!loginInput.email || !loginInput.password) {
        throw new BadRequestException('Email and password are required');
      }

      // Find user by email
      const user = await this.userService.findByEmail(loginInput.email);

      if (!user) {
        this.logger.warn(
          `Login attempt with non-existent email: ${loginInput.email}`,
        );
        throw new UnauthorizedException('Invalid credentials');
      }

      // Validate password
      const isPasswordValid = await this.userService.validatePassword(
        user,
        loginInput.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(`Invalid password for user: ${loginInput.email}`);
        throw new UnauthorizedException('Invalid credentials');
      }

      // Check if user is active
      if (!user.isActive) {
        this.logger.warn(
          `Login attempt for deactivated user: ${loginInput.email}`,
        );
        throw new UnauthorizedException('Account is deactivated');
      }

      // Update last login
      await this.userService.updateLastLogin(user._id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`User logged in successfully: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
  }

  async googleLogin(googleProfile: GoogleProfile): Promise<AuthResponse> {
    this.logger.log(
      `Processing Google OAuth login for email: ${googleProfile.email}`,
    );

    try {
      // Enhanced validation
      if (!googleProfile.email || !googleProfile.emailVerified) {
        throw new UnauthorizedException('Google account email is not verified');
      }

      if (!googleProfile.googleId) {
        throw new UnauthorizedException('Invalid Google profile data');
      }

      let user = await this.userService.findByGoogleId(googleProfile.googleId);

      if (!user) {
        // Check if user exists with the same email
        const existingUser = await this.userService.findByEmail(
          googleProfile.email,
        );

        if (existingUser) {
          // Link Google account to existing user if no Google ID
          if (!existingUser.googleId) {
            this.logger.log(
              `Linking Google account to existing user: ${googleProfile.email}`,
            );
            user = await this.userService.linkGoogleAccount(
              existingUser._id,
              googleProfile.googleId,
            );
          } else {
            this.logger.warn(
              `Google account conflict for email: ${googleProfile.email}`,
            );
            throw new ConflictException(
              'User already exists with different Google account',
            );
          }
        } else {
          // Create new user from Google profile
          this.logger.log(
            `Creating new user from Google profile: ${googleProfile.email}`,
          );

          const createUserDto: CreateUserDto = {
            username: await this.generateUniqueUsername(googleProfile.email),
            email: googleProfile.email,
            avatar: googleProfile.picture,
            googleId: googleProfile.googleId,
          };

          user = await this.userService.createGoogleUser(createUserDto);
        }
      }

      // Verify user is active
      if (!user.isActive) {
        this.logger.warn(
          `Google login attempt for deactivated user: ${user.email}`,
        );
        throw new UnauthorizedException('User account is deactivated');
      }

      // Update last login
      await this.userService.updateLastLogin(user._id);

      // Generate tokens
      const tokens = await this.generateTokens(user);

      this.logger.log(`Google OAuth login successful for user: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Google OAuth login failed: ${error.message}`);
      throw error;
    }
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const baseUsername = email.split('@')[0];
    let username = baseUsername;
    let counter = 1;

    // Ensure username is unique
    while (await this.userService.findByUsernameOptional(username)) {
      username = `${baseUsername}${counter}`;
      counter++;

      // Prevent infinite loop
      if (counter > 100) {
        throw new InternalServerErrorException(
          'Unable to generate unique username',
        );
      }
    }

    return username;
  }

  async validateUser(userId: string): Promise<UserSchema> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user.isActive) {
        throw new UnauthorizedException('User account is deactivated');
      }

      return user;
    } catch (error) {
      this.logger.error(
        `User validation failed for ID ${userId}: ${error.message}`,
      );
      throw error;
    }
  }

  private async generateTokens(user: UserSchema): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const payload = {
        sub: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        iat: Math.floor(Date.now() / 1000), // Issued at
      };

      const [accessToken, refreshToken] = await Promise.all([
        this.jwtService.signAsync(payload, {
          secret: environmentVariablesConfig.jwtSecret,
          expiresIn: environmentVariablesConfig.jwtExpiresIn,
          algorithm: 'HS256',
          issuer: 'luv-app-auth',
          audience: 'luv-app-api',
        }),
        this.jwtService.signAsync(payload, {
          secret: environmentVariablesConfig.jwtRefreshSecret,
          expiresIn: environmentVariablesConfig.jwtRefreshExpiresIn,
          algorithm: 'HS256',
          issuer: 'luv-app-auth',
          audience: 'luv-app-api',
        }),
      ]);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error(`Token generation failed: ${error.message}`);
      throw new InternalServerErrorException(
        'Failed to generate authentication tokens',
      );
    }
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    try {
      this.logger.log('Attempting to refresh tokens');

      if (!refreshToken) {
        throw new BadRequestException('Refresh token is required');
      }

      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: environmentVariablesConfig.jwtRefreshSecret,
        algorithms: ['HS256'],
      });

      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const tokens = await this.generateTokens(user);

      this.logger.log(`Tokens refreshed successfully for user: ${user.email}`);

      return {
        user,
        ...tokens,
      };
    } catch (error) {
      this.logger.error(`Token refresh failed: ${error.message}`);
      if (
        error.name === 'JsonWebTokenError' ||
        error.name === 'TokenExpiredError'
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }
      throw error;
    }
  }

  async logout(userId: string): Promise<boolean> {
    try {
      this.logger.log(`User logout requested for ID: ${userId}`);

      // In a production app, you might want to:
      // 1. Add the token to a blacklist
      // 2. Update user's last logout time
      // 3. Invalidate refresh tokens

      // For now, we'll just return true as the client will remove the token
      return true;
    } catch (error) {
      this.logger.error(`Logout failed for user ${userId}: ${error.message}`);
      throw error;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: environmentVariablesConfig.jwtSecret,
        algorithms: ['HS256'],
      });

      return payload;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
