import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user.response';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { Public } from '@src/common/decorators/public.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { GqlAuthGuard } from '@src/auth/guards/gql-auth.guard';
import { UserStatsResponse } from './dto/user-stats.response';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Mutation(() => UserResponse, {
    description: 'Register a new user account',
  })
  async registerUser(
    @Args('registerUserDto') registerUserDto: RegisterUserDto,
  ): Promise<UserResponse> {
    return this.userService.register(registerUserDto);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Create a new user (admin only)',
  })
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    return this.userService.create(createUserDto);
  }

  // @UseGuards(GqlAuthGuard)
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
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    // Users can only view their own profile, admins can view any
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser._id.toString() !== id
    ) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.findOne(id);
  }

  @Public()
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Update user profile',
  })
  async updateUser(
    @Args('id', { type: () => String }) id: string,
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    // Users can only update their own profile, admins can update any
    if (
      currentUser.role !== UserRole.ADMIN &&
      currentUser._id.toString() !== id
    ) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.update(id, updateUserDto);
  }

  @Mutation(() => UserResponse, {
    description: 'Deactivate user account (admin only)',
  })
  async removeUser(
    @Args('id', { type: () => String }) id: string,
  ): Promise<UserResponse> {
    return this.userService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Change user password',
  })
  async changePassword(
    @Args('oldPassword') oldPassword: string,
    @Args('newPassword') newPassword: string,
    @CurrentUser() currentUser: User,
  ): Promise<boolean> {
    await this.userService.changePassword(
      currentUser._id,
      oldPassword,
      newPassword,
    );
    return true;
  }

  // Statistics query
  @UseGuards(JwtAuthGuard)
  @Query(() => UserStatsResponse, {
    name: 'userStats',
    description: 'Get user statistics (admin only)',
  })
  async getUserStats(
    @CurrentUser() currentUser: User,
  ): Promise<UserStatsResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.getUserStats();
  }
}
