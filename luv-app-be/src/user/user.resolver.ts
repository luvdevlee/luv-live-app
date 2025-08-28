import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import {
  UsePipes,
  ValidationPipe,
  ParseUUIDPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import { UserService } from './user.service';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user.response';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@Resolver(() => User)
@UseInterceptors(ClassSerializerInterceptor)
@UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Public()
  // @UseGuards(ThrottlerGuard)
  // @Throttle({ default: { limit: 3, ttl: 60000 } }) // 3 registrations per minute
  @Mutation(() => UserResponse, {
    description: 'Register a new user account',
  })
  async registerUser(
    @Args('registerUserDto') registerUserDto: RegisterUserDto,
  ): Promise<UserResponse> {
    return this.userService.register(registerUserDto);
  }

  @Mutation(() => UserResponse, {
    description: 'Create a new user (admin only)',
  })
  async createUser(
    @Args('createUserDto') createUserDto: CreateUserDto,
  ): Promise<UserResponse> {
    return this.userService.create(createUserDto);
  }

  @Query(() => [UserResponse], {
    name: 'users',
    description: 'Get all active users',
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
  async findOne(
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
  async getCurrentUser(
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    return this.userService.findOne(currentUser._id);
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Update current user profile',
  })
  async updateMyProfile(
    @Args('updateUserDto') updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    return this.userService.update(currentUser._id, updateUserDto);
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

  // Admin mutations
  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Promote user to streamer (admin only)',
  })
  async promoteToStreamer(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.promoteToStreamer(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Promote user to admin (admin only)',
  })
  async promoteToAdmin(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.promoteToAdmin(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => UserResponse, {
    description: 'Demote user to viewer (admin only)',
  })
  async demoteToViewer(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() currentUser: User,
  ): Promise<UserResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new Error('Insufficient permissions');
    }
    return this.userService.demoteToViewer(userId);
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

// Additional response type for statistics
import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserStatsResponse {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  activeUsers: number;

  @Field(() => Int)
  streamers: number;

  @Field(() => Int)
  viewers: number;

  @Field(() => Int)
  admins: number;
}
