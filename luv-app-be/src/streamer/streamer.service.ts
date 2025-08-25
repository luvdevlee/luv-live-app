import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Streamer, StreamerDocument } from './schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { UpdateStreamerDto } from './dto/update-streamer.dto';

@Injectable()
export class StreamerService {
  constructor(
    @InjectModel(Streamer.name) private streamerModel: Model<StreamerDocument>,
  ) {}

  async create(
    userId: string,
    createStreamerDto: CreateStreamerDto,
  ): Promise<Streamer> {
    // Check if user already has a streamer profile
    const existingStreamer = await this.streamerModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .exec();

    if (existingStreamer) {
      throw new ConflictException('User already has a streamer profile');
    }

    // Check if stage name is already taken
    const existingStageName = await this.streamerModel
      .findOne({
        stageName: createStreamerDto.stageName,
      })
      .exec();

    if (existingStageName) {
      throw new ConflictException('Stage name already taken');
    }

    const createdStreamer = new this.streamerModel({
      ...createStreamerDto,
      userId: new Types.ObjectId(userId),
    });

    return createdStreamer.save();
  }

  async findAll(): Promise<Streamer[]> {
    return this.streamerModel.find().populate('userId').exec();
  }

  async findOne(id: string): Promise<Streamer> {
    const streamer = await this.streamerModel
      .findById(id)
      .populate('userId')
      .exec();
    if (!streamer) {
      throw new NotFoundException('Streamer not found');
    }
    return streamer;
  }

  async findByUserId(userId: string): Promise<Streamer> {
    const streamer = await this.streamerModel
      .findOne({
        userId: new Types.ObjectId(userId),
      })
      .populate('userId')
      .exec();

    if (!streamer) {
      throw new NotFoundException('Streamer profile not found');
    }
    return streamer;
  }

  async findByStageName(stageName: string): Promise<Streamer> {
    const streamer = await this.streamerModel
      .findOne({ stageName })
      .populate('userId')
      .exec();
    if (!streamer) {
      throw new NotFoundException('Streamer not found');
    }
    return streamer;
  }

  async findVerifiedStreamers(): Promise<Streamer[]> {
    return this.streamerModel
      .find({ isVerified: true })
      .populate('userId')
      .exec();
  }

  async update(
    id: string,
    updateStreamerDto: UpdateStreamerDto,
  ): Promise<Streamer> {
    // Check if stage name is already taken (if being updated)
    if (updateStreamerDto.stageName) {
      const existingStageName = await this.streamerModel
        .findOne({
          $and: [
            { _id: { $ne: id } },
            { stageName: updateStreamerDto.stageName },
          ],
        })
        .exec();

      if (existingStageName) {
        throw new ConflictException('Stage name already taken');
      }
    }

    const updatedStreamer = await this.streamerModel
      .findByIdAndUpdate(id, updateStreamerDto, { new: true })
      .populate('userId')
      .exec();

    if (!updatedStreamer) {
      throw new NotFoundException('Streamer not found');
    }

    return updatedStreamer;
  }

  async remove(id: string): Promise<Streamer> {
    const deletedStreamer = await this.streamerModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedStreamer) {
      throw new NotFoundException('Streamer not found');
    }
    return deletedStreamer;
  }

  async incrementFollowers(id: string): Promise<void> {
    await this.streamerModel
      .findByIdAndUpdate(id, {
        $inc: { totalFollowers: 1 },
      })
      .exec();
  }

  async decrementFollowers(id: string): Promise<void> {
    await this.streamerModel
      .findByIdAndUpdate(id, {
        $inc: { totalFollowers: -1 },
      })
      .exec();
  }

  async incrementViews(id: string, count: number = 1): Promise<void> {
    await this.streamerModel
      .findByIdAndUpdate(id, {
        $inc: { totalViews: count },
      })
      .exec();
  }

  async verifyStreamer(id: string): Promise<Streamer> {
    const streamer = await this.streamerModel
      .findByIdAndUpdate(id, { isVerified: true }, { new: true })
      .populate('userId')
      .exec();

    if (!streamer) {
      throw new NotFoundException('Streamer not found');
    }

    return streamer;
  }
}
