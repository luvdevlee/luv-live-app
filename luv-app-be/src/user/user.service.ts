import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt';

import { User, UserDocument, UserRole } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly saltRounds = 12; // Increased for better security

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async register(registerUserDto: RegisterUserDto): Promise<User> {
    try {
      this.logger.log(`Registering new user: ${registerUserDto.username}`);

      // Check if username or email already exists
      const existingUser = await this.userModel.findOne({
        $or: [
          { username: registerUserDto.username },
          { email: registerUserDto.email },
        ],
      });

      if (existingUser) {
        this.logger.warn(
          `Registration failed: Username or email already exists for ${registerUserDto.username}`,
        );
        throw new ConflictException('Username or email already exists');
      }

      let password_hash: string;
      try {
        password_hash = await this.hashPassword(registerUserDto.password);
      } catch (hashError) {
        this.logger.error(`Password hashing failed: ${hashError.message}`);
        throw new BadRequestException('Failed to process password');
      }

      const userData = {
        username: registerUserDto.username,
        email: registerUserDto.email,
        password_hash,
        display_name: registerUserDto.display_name || registerUserDto.username,
        avatar_url: registerUserDto.avatar_url,
        role: UserRole.VIEWER,
        is_active: true,
      };

      // Create and save user
      try {
        const createdUser = new this.userModel(userData);
        const savedUser = await createdUser.save();
        
        this.logger.log(`User registered successfully: ${savedUser._id}`);
        return savedUser;
      } catch (saveError) {
        this.logger.error(`User save failed: ${saveError.message}`);
        throw new BadRequestException('Failed to save user');
      }
    } catch (error) {
      if (error instanceof ConflictException || error instanceof BadRequestException) {
        throw error; // Re-throw HTTP exceptions
      }
      
      this.logger.error(`Unexpected error in registration: ${error.message}`, error.stack);
      throw new BadRequestException('Registration failed');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    this.logger.log(`Creating new user: ${createUserDto.username}`);

    // Check if username or email already exists
    const existingUser = await this.userModel.findOne({
      $or: [{ username: createUserDto.username }, { email: createUserDto.email }],
    });

    if (existingUser) {
      this.logger.warn(
        `User creation failed: Username or email already exists for ${createUserDto.username}`,
      );
      throw new ConflictException('Username or email already exists');
    }

    let password_hash: string | undefined = undefined;
    if (createUserDto.password) {
      password_hash = await this.hashPassword(createUserDto.password);
    }

    const userData = {
      ...createUserDto,
      password_hash,
      display_name: createUserDto.display_name || createUserDto.username,
      role: createUserDto.role || UserRole.VIEWER,
      is_active:
        createUserDto.is_active !== undefined ? createUserDto.is_active : true,
    };

    try {
      const createdUser = new this.userModel(userData);
      const savedUser = await createdUser.save();
      this.logger.log(`User created successfully: ${savedUser._id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(
        `Failed to create user: ${error.message}`,
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

  async findOne(id: string): Promise<User> {
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

    return user;
  }

  async findByUsername(username: string): Promise<User> {
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

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    return this.userModel
      .findOne({ email, is_active: true })
      .exec();
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    if (!email) {
      return null;
    }

    return this.userModel.findOne({ email, is_active: true }).exec();
  }

  async findByUsernameOptional(username: string): Promise<User | null> {
    if (!username) {
      return null;
    }

    return this.userModel
      .findOne({ username, is_active: true })
      .select('-password_hash')
      .exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    if (!googleId) {
      return null;
    }

    return this.userModel
      .findOne({ google_id: googleId, is_active: true })
      .select('-password_hash')
      .exec();
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

    this.logger.log(`Google account linked successfully for user: ${userId}`);
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

  async remove(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid user ID format');
    }

    const deletedUser = await this.userModel
      .findByIdAndUpdate(id, { is_active: false }, { new: true })
      .select('-password_hash')
      .exec();

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User deactivated successfully: ${id}`);
    return deletedUser;
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
      return await bcrypt.compare(password, user.password_hash);
    } catch (error) {
      this.logger.error(`Password validation error: ${error.message}`);
      return false;
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ): Promise<void> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password_hash) {
      throw new BadRequestException('Cannot change password for Google users');
    }

    const isOldPasswordValid = await this.validatePassword(user, oldPassword);
    if (!isOldPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPasswordHash = await this.hashPassword(newPassword);
    await this.userModel
      .findByIdAndUpdate(userId, { password_hash: newPasswordHash })
      .exec();

    this.logger.log(`Password changed successfully for user: ${userId}`);
  }

  private async hashPassword(password: string): Promise<string> {
    if (!password || typeof password !== 'string') {
      throw new BadRequestException('Invalid password format');
    }
    
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hash = await bcrypt.hash(password, salt);
      return hash;
    } catch (error) {
      this.logger.error(`Password hashing error: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to process password');
    }
  }

  // Admin methods
  async promoteToStreamer(userId: string): Promise<User> {
    return this.updateUserRole(userId, UserRole.STREAMER);
  }

  async promoteToAdmin(userId: string): Promise<User> {
    return this.updateUserRole(userId, UserRole.ADMIN);
  }

  async demoteToViewer(userId: string): Promise<User> {
    return this.updateUserRole(userId, UserRole.VIEWER);
  }

  private async updateUserRole(userId: string, role: UserRole): Promise<User> {
    if (!userId) {
      throw new BadRequestException('Invalid user ID format');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { role }, { new: true })
      .select('-password_hash')
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    this.logger.log(`User role updated to ${role} for user: ${userId}`);
    return updatedUser;
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
