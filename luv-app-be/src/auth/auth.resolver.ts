import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { LoginInput } from './dto/login.input';
import { CreateUserInput } from '../user/dto/create-user.dto';

@Resolver()
@UsePipes(new ValidationPipe({ transform: true }))
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('createUserInput') createUserInput: CreateUserInput): Promise<AuthResponse> {
    return this.authService.register(createUserInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Mutation(() => AuthResponse)
  async refreshTokens(@Args('refreshToken') refreshToken: string): Promise<AuthResponse> {
    return this.authService.refreshTokens(refreshToken);
  }

  @Mutation(() => Boolean)
  async logout(@Args('userId') userId: string): Promise<boolean> {
    return this.authService.logout(userId);
  }
}
