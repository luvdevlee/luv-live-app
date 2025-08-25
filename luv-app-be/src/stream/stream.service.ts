import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Stream, StreamDocument, StreamStatus } from './schemas/stream.schema';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';

@Injectable()
export class StreamService {
  constructor(
    @InjectModel(Stream.name) private streamModel: Model<StreamDocument>,
  ) {}

  async create(
    streamerId: string,
    createStreamDto: CreateStreamDto,
  ): Promise<Stream> {
    // Generate unique stream key
    const streamKey = this.generateStreamKey();

    const createdStream = new this.streamModel({
      ...createStreamDto,
      streamerId: new Types.ObjectId(streamerId),
      streamKey,
      status: StreamStatus.SCHEDULED,
    });

    return createdStream.save();
  }

  async findAll(): Promise<Stream[]> {
    return this.streamModel.find().populate('streamerId').exec();
  }

  async findOne(id: string): Promise<Stream> {
    const stream = await this.streamModel
      .findById(id)
      .populate('streamerId')
      .exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }
    return stream;
  }

  async findByStreamerId(streamerId: string): Promise<Stream[]> {
    return this.streamModel
      .find({ streamerId: new Types.ObjectId(streamerId) })
      .populate('streamerId')
      .exec();
  }

  async findLiveStreams(): Promise<Stream[]> {
    return this.streamModel
      .find({ status: StreamStatus.LIVE })
      .populate('streamerId')
      .exec();
  }

  async findScheduledStreams(): Promise<Stream[]> {
    return this.streamModel
      .find({ status: StreamStatus.SCHEDULED })
      .populate('streamerId')
      .exec();
  }

  async findByCategory(category: string): Promise<Stream[]> {
    return this.streamModel.find({ category }).populate('streamerId').exec();
  }

  async update(id: string, updateStreamDto: UpdateStreamDto): Promise<Stream> {
    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Prevent updating if stream is live
    if (stream.status === StreamStatus.LIVE) {
      throw new BadRequestException('Cannot update live stream');
    }

    const updatedStream = await this.streamModel
      .findByIdAndUpdate(id, updateStreamDto, { new: true })
      .populate('streamerId')
      .exec();

    if (!updatedStream) {
      throw new NotFoundException('Stream not found');
    }

    return updatedStream;
  }

  async remove(id: string): Promise<Stream> {
    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Prevent deleting if stream is live
    if (stream.status === StreamStatus.LIVE) {
      throw new BadRequestException('Cannot delete live stream');
    }

    const deletedStream = await this.streamModel.findByIdAndDelete(id).exec();

    if (!deletedStream) {
      throw new NotFoundException('Stream not found');
    }

    return deletedStream;
  }

  async startStream(id: string): Promise<Stream> {
    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    if (stream.status === StreamStatus.LIVE) {
      throw new BadRequestException('Stream is already live');
    }

    if (stream.status === StreamStatus.ENDED) {
      throw new BadRequestException('Cannot restart ended stream');
    }

    const updatedStream = await this.streamModel
      .findByIdAndUpdate(
        id,
        {
          status: StreamStatus.LIVE,
          startedAt: new Date(),
        },
        { new: true },
      )
      .populate('streamerId')
      .exec();

    if (!updatedStream) {
      throw new NotFoundException('Stream not found');
    }

    return updatedStream;
  }

  async endStream(id: string): Promise<Stream> {
    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    if (stream.status !== StreamStatus.LIVE) {
      throw new BadRequestException('Stream is not live');
    }

    const updatedStream = await this.streamModel
      .findByIdAndUpdate(
        id,
        {
          status: StreamStatus.ENDED,
          endedAt: new Date(),
        },
        { new: true },
      )
      .populate('streamerId')
      .exec();

    if (!updatedStream) {
      throw new NotFoundException('Stream not found');
    }

    return updatedStream;
  }

  async updateViewerCount(id: string, viewerCount: number): Promise<void> {
    await this.streamModel
      .findByIdAndUpdate(id, {
        $set: { maxViewers: Math.max(viewerCount, 0) },
        $inc: { totalViewers: 1 },
      })
      .exec();
  }

  async setPlaybackUrl(id: string, playbackUrl: string): Promise<Stream> {
    const updatedStream = await this.streamModel
      .findByIdAndUpdate(id, { playbackUrl }, { new: true })
      .populate('streamerId')
      .exec();

    if (!updatedStream) {
      throw new NotFoundException('Stream not found');
    }

    return updatedStream;
  }

  async findByStreamKey(streamKey: string): Promise<Stream> {
    const stream = await this.streamModel
      .findOne({ streamKey })
      .populate('streamerId')
      .exec();

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    return stream;
  }

  private generateStreamKey(): string {
    // Generate a unique stream key
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    return `stream_${timestamp}_${random}`;
  }
}
