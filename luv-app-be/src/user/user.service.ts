import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from '@src/user/schemas/user.schema';
import { CreateUserInput } from '@src/user/dto/create-user.dto';
import { UpdateUserInput } from '@src/user/dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { email: createUserInput.email },
        { username: createUserInput.username },
      ],
    });

    if (existingUser) {
      throw new ConflictException('User with this email or username already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserInput.password, saltRounds);

    // Create user
    const createdUser = new this.userModel({
      ...createUserInput,
      password: hashedPassword,
      displayName: createUserInput.displayName || createUserInput.username,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    // Check if user exists
    const existingUser = await this.userModel.findById(id);
    if (!existingUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Check for conflicts with email/username
    if (updateUserInput.email || updateUserInput.username) {
      const conflictUser = await this.userModel.findOne({
        _id: { $ne: id },
        $or: [
          ...(updateUserInput.email ? [{ email: updateUserInput.email }] : []),
          ...(updateUserInput.username ? [{ username: updateUserInput.username }] : []),
        ],
      });

      if (conflictUser) {
        throw new ConflictException('User with this email or username already exists');
      }
    }

    // Hash password if provided
    const updateData = { ...updateUserInput };
    if (updateUserInput.password) {
      const saltRounds = 12;
      updateData.password = await bcrypt.hash(updateUserInput.password, saltRounds);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    return updatedUser as User;
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return true;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, {
      lastLoginAt: new Date(),
    }).exec();
  }
}
