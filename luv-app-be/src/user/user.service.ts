import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check if username or email already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash password if provided
    let hashedPassword = '';
    if (createUserDto.password) {
      hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find({ isActive: true }).exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsernameOptional(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async createGoogleUser(createUserDto: CreateUserDto): Promise<User> {
    // Check if email already exists
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Generate unique username if needed
    let username = createUserDto.username;
    let counter = 1;
    while (await this.userModel.findOne({ username })) {
      username = `${createUserDto.username}${counter}`;
      counter++;
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      username,
      password: '', // No password for Google users
    });

    return createdUser.save();
  }

  async linkGoogleAccount(userId: string, googleId: string): Promise<User> {
    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, { googleId }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
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
        throw new ConflictException('Username or email already exists');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const deletedUser = await this.userModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }

    return deletedUser;
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false; // Google users don't have passwords
    }
    return bcrypt.compare(password, user.password);
  }
}
