import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import {
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import {
  AuthResponse,
  LogoutResponse,
  RefreshTokenResponse,
} from './dto/auth.response';
import { RegisterUserDto } from '@src/user/dto/register-user.dto';
import { RefreshTokenInput } from './dto/refresh-token.input';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { User } from '@src/user/schemas/user.schema';

@Resolver()
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Mutation(() => AuthResponse, {
    description: 'Login with email and password',
  })
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Public()
  @Mutation(() => AuthResponse, {
    name: 'register',
    description: 'Register a new account',
  })
  async register(
    @Args('registerUserDto') registerUserDto: RegisterUserDto,
  ): Promise<AuthResponse> {
    if (!registerUserDto) {
      throw new BadRequestException('Register user data is required');
    }
    return this.authService.register(registerUserDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => LogoutResponse, {
    description: 'Logout from the system',
  })
  async logout(
    @CurrentUser() currentUser: User,
    @Context() context: any,
  ): Promise<LogoutResponse> {
    // Extract token from Authorization header
    const authHeader = context.req.headers.authorization;
    const token =
      authHeader && authHeader.startsWith('Bearer ')
        ? authHeader.substring(7)
        : null;

    if (!token) {
      throw new Error('Token not found');
    }

    return this.authService.logout(currentUser._id, token);
  }

  @Public()
  @Mutation(() => RefreshTokenResponse, {
    description: 'Refresh access token',
  })
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ): Promise<RefreshTokenResponse> {
    return this.authService.refreshToken(refreshTokenInput);
  }
}
