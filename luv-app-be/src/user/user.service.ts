import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './dto/user.response';
import { BcryptService } from '@src/auth/bcrypt.service';
import { UsersQueryDto } from './dto/users-query.dto';
import { UsersPaginatedResponse, PaginationMeta } from './dto/users-paginated.response';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly bcryptService: BcryptService,
  ) {}

  async register(registerUserDto: RegisterUserDto): Promise<UserResponse> {
    try {
      const existingUser = await this.userModel.findOne({
        $or: [
          { username: registerUserDto.username },
          { email: registerUserDto.email },
        ],
      });

      if (existingUser) {
        throw new ConflictException('Username or Email does existing!');
      }

      const userData = {
        username: registerUserDto.username,
        email: registerUserDto.email,
        password_hash: await this.bcryptService.hash(registerUserDto.password),
        display_name: registerUserDto.display_name || registerUserDto.username,
        avatar_url: registerUserDto.avatar_url,
        role: UserRole.VIEWER,
        is_active: true,
      };

      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();

      return {
        _id: savedUser._id.toString(),
        username: savedUser.username,
        email: savedUser.email,
        google_id: savedUser.google_id,
        avatar_url: savedUser.avatar_url,
        display_name: savedUser.display_name,
        role: savedUser.role,
        is_active: savedUser.is_active,
        last_login_at: savedUser.last_login_at,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error(`Register failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to register!');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    const userData: any = {
      username: createUserDto.username,
      email: createUserDto.email,
      display_name: createUserDto.display_name || createUserDto.username,
      avatar_url: createUserDto.avatar_url,
      role: createUserDto.role || UserRole.VIEWER,
      is_active:
        createUserDto.is_active !== undefined ? createUserDto.is_active : true,
    };

    if (createUserDto.google_id) {
      userData.google_id = createUserDto.google_id;
    }

    if (createUserDto.password) {
      userData.password_hash = await this.bcryptService.hash(
        createUserDto.password,
      );
    }

    try {
      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Admin created user failed: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create user');
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel
      .find({ is_active: true })
      .select('-password_hash')
      .lean()
      .exec();
  }

  async findAllPaginated(queryDto: UsersQueryDto): Promise<UsersPaginatedResponse> {
    const { page = 1, limit = 10, search, role, is_active, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;
    
    const filter: any = {};
    
    if (is_active !== undefined) {
      filter.is_active = is_active;
    }
    
    if (role) {
      filter.role = role;
    }
    
    if (search && search.trim()) {
      filter.$or = [
        { username: { $regex: search.trim(), $options: 'i' } },
        { email: { $regex: search.trim(), $options: 'i' } },
        { display_name: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'ASC' ? 1 : -1;

    try {
      const [users, totalCount] = await Promise.all([
        this.userModel
          .find(filter)
          .select('-password_hash')
          .sort(sortConfig)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.userModel.countDocuments(filter).exec(),
      ]);

      const totalPages = Math.ceil(totalCount / limit);
      const hasNext = page < totalPages;
      const hasPrev = page > 1;

      const meta: PaginationMeta = {
        currentPage: page,
        totalPages,
        totalCount,
        limit,
        hasNext,
        hasPrev,
      };

      const transformedUsers = users.map(user => this.transformUserResponse(user));

      return {
        users: transformedUsers,
        meta,
      };
    } catch (error) {
      this.logger.error(`Find users with pagination failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch users');
    }
  }

  /**
   * Transform user document to response format with proper timestamps
   */
  private transformUserResponse(user: any): UserResponse {
    const userResponse: UserResponse = {
      _id: user._id.toString(),
      username: user.username,
      email: user.email,
      google_id: user.google_id,
      avatar_url: user.avatar_url,
      display_name: user.display_name,
      role: user.role,
      is_active: user.is_active,
      last_login_at: user.last_login_at,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userResponse;
  }

  async findOne(id: string): Promise<UserResponse> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel
      .findById(id)
      .select('-password_hash')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transformUserResponse(user);
  }

  async findByUsername(username: string): Promise<UserResponse> {
    if (!username) {
      throw new BadRequestException('Username is required');
    }

    const user = await this.userModel
      .findOne({ username, is_active: true })
      .select('-password_hash')
      .exec();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.transformUserResponse(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    const user = await this.userModel
      .findOne({ email, is_active: true })
      .exec();
    if (!user) {
      return null;
    }

    return user;
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    return this.userModel.findOne({ email, is_active: true }).exec();
  }

  async createGoogleUser(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating Google user: ${createUserDto.email}`);

    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      this.logger.warn(
        `Google user creation failed: Email already exists ${createUserDto.email}`,
      );
      throw new ConflictException('Email already exists');
    }

    // Generate unique username if needed
    let username = createUserDto.username;
    let counter = 1;
    while (await this.userModel.findOne({ username })) {
      username = `${createUserDto.username}${counter}`;
      counter++;
    }

    const userData = {
      ...createUserDto,
      username,
      display_name: createUserDto.display_name || username,
      role: UserRole.VIEWER,
      is_active: true,
    };

    try {
      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();

      this.logger.log(`Google user created successfully: ${savedUser._id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to create Google user: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException('Failed to create Google user');
    }
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID format');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { google_id: googleId }, { new: true })
      .select('-password_hash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }

    // Check if username or email already exists (if being updated)
    if (updateUserDto.username || updateUserDto.email) {
      const existingUser = await this.userModel.findOne({
        $and: [
          { _id: { $ne: id } },
          {
            $or: [
              ...(updateUserDto.username
                ? [{ username: updateUserDto.username }]
                : []),
              ...(updateUserDto.email ? [{ email: updateUserDto.email }] : []),
            ],
          },
        ],
      });

      if (existingUser) {
        this.logger.warn(
          `Update failed: Username or email already exists for user ${id}`,
        );
        throw new ConflictException('Username or email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password_hash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User updated successfully: ${id}`);
    return updatedUser;
  }

  async removeUser(id: string): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.is_active) {
      return false;
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { is_active: false }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Failed to deactivate user');
    }

    this.logger.log(`User deactivated successfully: ${id}`);
    return true;
  }

  async deleteUser(id: string): Promise<boolean> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.role === UserRole.ADMIN) {
      throw new BadRequestException('Cannot delete admin users');
    }
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('Failed to delete user');
    }
    return true;
  }

  async updateLastLogin(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }

    await this.userModel
      .findByIdAndUpdate(id, { last_login_at: new Date() })
      .exec();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password_hash) {
      return false; // Google users don't have passwords
    }

    try {
      return await this.bcryptService.compare(password, user.password_hash);
    } catch (error) {
      this.logger.error(`Password validation error: ${error.message}`);
      return false;
    }
  }

  async changePassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await this.validatePassword(user, oldPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    user.password_hash = await this.bcryptService.hash(newPassword);
    await user.save();
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    streamers: number;
    viewers: number;
    admins: number;
  }> {
    const [totalUsers, activeUsers, streamers, viewers, admins] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ is_active: true }),
        this.userModel.countDocuments({
          role: UserRole.STREAMER,
          is_active: true,
        }),
        this.userModel.countDocuments({
          role: UserRole.VIEWER,
          is_active: true,
        }),
        this.userModel.countDocuments({
          role: UserRole.ADMIN,
          is_active: true,
        }),
      ]);

    return {
      totalUsers,
      activeUsers,
      streamers,
      viewers,
      admins,
    };
  }
}
