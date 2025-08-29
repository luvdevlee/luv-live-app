import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './dto/user.response';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import type { AuthUser } from './dto/auth-user.dto';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Create a new user (admin only)',
  })
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can create users');
    }
    const user = await this.userService.create(createUserDto);
    return user;
  }

  @Query(() => [UserResponse], {
    name: 'users',
    description: 'Get all active users (admin only)',
  })
  async findAll(): Promise<User[]> {
    const users = await this.userService.findAll();
    return users.map((user) => ({
      ...user,
      _id: user._id.toString(),
    }));
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserResponse, {
    name: 'user',
    description: 'Get user by ID',
  })
  async findById(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UserResponse> {
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser.sub.toString() !== id
    ) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserResponse, {
    name: 'userByUsername',
    description: 'Get user by username (public)',
  })
  async findByUsername(
    @Args('username', { type: () => String }) username: string,
  ): Promise<UserResponse> {
    return this.userService.findByUsername(username);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => UserResponse, {
    name: 'me',
    description: 'Get current user profile',
  })
  async getCurrentUser(@CurrentUser() currentUser: any): Promise<UserResponse> {
    if (!currentUser.sub) {
      throw new UnauthorizedException('You are not authenticated');
    }
    return this.userService.findOne(currentUser.sub);
  }
}
