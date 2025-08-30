import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/schemas/user.schema';
import { LoginInput } from './dto/login.input';
import {
  AuthResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from './dto/auth.response';
import { RegisterUserDto } from '@src/user/dto/register-user.dto';
import { RefreshTokenInput } from './dto/refresh-token.input';
import jwtConfig from '@src/common/config/jwt.config';
import type { ConfigType } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof jwtConfig>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<AuthResponse> {
    try {
      console.log(registerUserDto);
      await this.userService.register(registerUserDto);
      const user = await this.userService.findByUsername(
        registerUserDto.username,
      );
      const tokens = await this.generateTokens(user);

      await this.userService.updateLastLogin(user._id);

      return {
        ...tokens,
        user,
      };
    } catch (error) {
      this.logger.error(`Registration failed: ${error.message}`);
      throw error;
    }
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    try {
      const user = await this.userService.findByEmailWithPassword(
        loginInput.email,
      );

      if (!user) {
        this.logger.warn(`Login failed: User not found - ${loginInput.email}`);
        throw new UnauthorizedException('Email or password is incorrect');
      }

      if (!user.is_active) {
        this.logger.warn(`Login failed: User inactive - ${loginInput.email}`);
        throw new UnauthorizedException('This account is inactive');
      }

      const isPasswordValid = await this.userService.validatePassword(
        user,
        loginInput.password,
      );

      if (!isPasswordValid) {
        this.logger.warn(
          `Login failed: Invalid password - ${loginInput.email}`,
        );
        throw new UnauthorizedException('Email or password is incorrect');
      }

      const tokens = await this.generateTokens(user);
      await this.userService.updateLastLogin(user._id);

      const userObj = (user as any).toJSON ? (user as any).toJSON() : user;
      const { password_hash, ...userResponse } = userObj;

      return {
        ...tokens,
        user: userResponse as User,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.logger.error(`Login error: ${error.message}`);
      throw new BadRequestException('Login failed');
    }
  }

  async logout(userId: string, token: string): Promise<LogoutResponse> {
    try {
      this.logger.log(`Logout request for user: ${userId}`);
      this.logger.log(`User logged out successfully: ${userId}`);

      return {
        message: 'Đăng xuất thành công',
        success: true,
      };
    } catch (error) {
      this.logger.error(`Logout error: ${error.message}`);
      throw new BadRequestException('Đăng xuất thất bại');
    }
  }

  async refreshToken(
    refreshTokenInput: RefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    try {
      const { refresh_token } = refreshTokenInput;
      const payload = this.jwtService.verify(refresh_token, {
        secret: this.jwtConfiguration.refreshSecret!,
      });

      const user = await this.userService.findOne(payload.sub);

      if (!user || !user.is_active) {
        throw new UnauthorizedException('This account is inactive');
      }

      const accessToken = await this.generateAccessToken(user);

      return {
        access_token: accessToken,
      };
    } catch (error) {
      this.logger.error(`Token refresh error: ${error.message}`);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async validateUser(userId: string): Promise<User | null> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user || !user.is_active) {
        return null;
      }

      return user;
    } catch (error) {
      this.logger.error(`User validation error: ${error.message}`);
      return null;
    }
  }

  private async generateTokens(user: User): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfiguration.secret,
        expiresIn: this.jwtConfiguration.accessTokenTtl,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.jwtConfiguration.refreshSecret,
        expiresIn: this.jwtConfiguration.refreshTokenTtl,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private async generateAccessToken(user: User): Promise<string> {
    const payload: JwtPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    return this.jwtService.signAsync(payload, {
      secret: this.jwtConfiguration.secret,
      expiresIn: this.jwtConfiguration.accessTokenTtl,
    });
  }
}
