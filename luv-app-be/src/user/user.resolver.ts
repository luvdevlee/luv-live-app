import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UserResponse } from './dto/user.response';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersPaginatedResponse } from './dto/users-paginated.response';
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

  @UseGuards(JwtAuthGuard)
  @Query(() => UsersPaginatedResponse, {
    name: 'users',
    description: 'Get users with pagination and filtering (admin only)',
  })
  async findAllPaginated(
    @Args('query', { type: () => UsersQueryDto, nullable: true }) query: UsersQueryDto = new UsersQueryDto(),
    @CurrentUser() currentUser: AuthUser,
  ): Promise<UsersPaginatedResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can access user list');
    }

    return this.userService.findAllPaginated(query);
  }

  @Query(() => [UserResponse], {
    name: 'usersSimple',
    description: 'Get simple list of active users (for backward compatibility)',
  })
  async findAll(): Promise<UserResponse[]> {
    const result = await this.userService.findAllPaginated({
      page: 1,
      limit: 100,
      is_active: true,
    });
    return result.users;
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Deactivate user (soft delete - admin only)',
  })
  async removeUser(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<boolean> {
    if (currentUser.sub.toString() !== userId) {
      throw new BadRequestException('Cannot remove other users');
    }
    return this.userService.removeUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Permanently delete user (hard delete - admin only)',
  })
  async deleteUser(
    @Args('userId', { type: () => String }) userId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<boolean> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can delete users');
    }

    if (currentUser.sub.toString() === userId) {
      throw new BadRequestException('You cannot delete yourself');
    }

    return this.userService.deleteUser(userId);
  }
}
