import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '@src/user/user.service';
import { LoginInput } from '@src/auth/dto/login.input';
import { CreateUserDto } from '@src/user/dto/create-user.dto';
import { User } from '@src/user/schemas/user.schema';
import { AuthResponse } from '@src/auth/dto/auth.response';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    // Create user
    const user = await this.userService.create(createUserDto);

    // Generate tokens (implement JWT logic here)
    const tokens = this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    // Find user by email
    const user = await this.userService.findByEmail(loginInput.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Validate password
    const isPasswordValid = await this.userService.validatePassword(
      user,
      loginInput.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.userService.updateLastLogin(user._id);

    // Generate tokens
    const tokens = this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  async validateUser(userId: string): Promise<User> {
    return this.userService.findOne(userId);
  }

  private generateTokens(user: User): {
    accessToken: string;
    refreshToken: string;
  } {
    // TODO: Implement JWT token generation
    // This is a placeholder implementation
    return {
      accessToken: `access_token_for_${user._id}`,
      refreshToken: `refresh_token_for_${user._id}`,
    };
  }

  async refreshTokens(refreshToken: string): Promise<AuthResponse> {
    // TODO: Implement refresh token logic
    throw new Error('Refresh token functionality not implemented yet');
  }

  async logout(userId: string): Promise<boolean> {
    // TODO: Implement logout logic (invalidate tokens)
    return true;
  }
}
