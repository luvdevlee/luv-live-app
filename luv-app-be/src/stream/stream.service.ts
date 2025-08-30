import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { Stream, StreamDocument, Status, PrivacyStatus } from './schemas/stream.schema';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { StreamResponse } from './dto/stream.response';
import { StreamsQueryDto } from './dto/streams-query.dto';
import { StreamsPaginatedResponse } from './dto/streams-paginated.response';
import { PaginationMeta } from '@src/user/dto/users-paginated.response';
import { UserRole } from '@src/user/schemas/user.schema';
import { UserService } from '@src/user/user.service';

@Injectable()
export class StreamService {
  private readonly logger = new Logger(StreamService.name);

  constructor(
    @InjectModel(Stream.name) private streamModel: Model<StreamDocument>,
    private readonly userService: UserService,
  ) {}

  async create(createStreamDto: CreateStreamDto, userId: string): Promise<StreamResponse> {
    try {
      // Kiểm tra user có quyền tạo stream không (streamer hoặc admin)
      const user = await this.userService.findOne(userId);
      if (user.role !== UserRole.STREAMER && user.role !== UserRole.ADMIN) {
        throw new ForbiddenException('Only streamers and admins can create streams');
      }

      const streamData = {
        ...createStreamDto,
        user_id: new Types.ObjectId(userId),
        status: createStreamDto.status || Status.LIVE,
        privacy: createStreamDto.privacy || PrivacyStatus.PUBLIC,
      };

      const createdStream = new this.streamModel(streamData);
      const savedStream = await createdStream.save();

      return this.transformStreamResponse(savedStream);
    } catch (error) {
      if (error instanceof ForbiddenException || error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Create stream failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to create stream');
    }
  }

  async findAll(): Promise<StreamResponse[]> {
    const streams = await this.streamModel
      .find({ privacy: PrivacyStatus.PUBLIC })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return streams.map(stream => this.transformStreamResponse(stream));
  }

  async findAllPaginated(queryDto: StreamsQueryDto): Promise<StreamsPaginatedResponse> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      privacy, 
      category, 
      user_id,
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = queryDto;
    
    const filter: any = {};
    
    // Chỉ hiển thị public streams cho user thường
    // Admin có thể xem tất cả, owner có thể xem stream của mình
    if (privacy !== undefined) {
      filter.privacy = privacy;
    } else {
      filter.privacy = PrivacyStatus.PUBLIC; // Mặc định chỉ hiển thị public
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (user_id) {
      filter.user_id = new Types.ObjectId(user_id);
    }
    
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'ASC' ? 1 : -1;

    try {
      const [streams, totalCount] = await Promise.all([
        this.streamModel
          .find(filter)
          .sort(sortConfig)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.streamModel.countDocuments(filter).exec(),
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

      const transformedStreams = streams.map(stream => this.transformStreamResponse(stream));

      return {
        streams: transformedStreams,
        meta,
      };
    } catch (error) {
      this.logger.error(`Find streams with pagination failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch streams');
    }
  }

  async findMyStreams(userId: string, queryDto: StreamsQueryDto): Promise<StreamsPaginatedResponse> {
    const filterWithUser = {
      ...queryDto,
      user_id: userId,
    };
    
    // Remove privacy filter để user có thể xem tất cả stream của mình
    const { privacy, ...queryWithoutPrivacy } = filterWithUser;
    
    return this.findAllPaginatedWithPermission(queryWithoutPrivacy, userId, UserRole.STREAMER);
  }

  async findAllPaginatedWithPermission(
    queryDto: StreamsQueryDto, 
    userId?: string, 
    userRole?: UserRole
  ): Promise<StreamsPaginatedResponse> {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      status, 
      privacy, 
      category, 
      user_id,
      sortBy = 'createdAt', 
      sortOrder = 'DESC' 
    } = queryDto;
    
    const filter: any = {};
    
    // Kiểm tra quyền xem stream
    if (userRole === UserRole.ADMIN) {
      // Admin có thể xem tất cả
      if (privacy !== undefined) {
        filter.privacy = privacy;
      }
    } else if (userId && user_id === userId) {
      // User xem stream của chính mình
      if (privacy !== undefined) {
        filter.privacy = privacy;
      }
    } else {
      // User thường chỉ xem được public streams
      filter.privacy = PrivacyStatus.PUBLIC;
    }
    
    if (status) {
      filter.status = status;
    }
    
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    if (user_id) {
      filter.user_id = new Types.ObjectId(user_id);
    }
    
    if (search && search.trim()) {
      filter.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { category: { $regex: search.trim(), $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    
    const sortConfig: any = {};
    sortConfig[sortBy] = sortOrder === 'ASC' ? 1 : -1;

    try {
      const [streams, totalCount] = await Promise.all([
        this.streamModel
          .find(filter)
          .sort(sortConfig)
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.streamModel.countDocuments(filter).exec(),
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

      const transformedStreams = streams.map(stream => this.transformStreamResponse(stream));

      return {
        streams: transformedStreams,
        meta,
      };
    } catch (error) {
      this.logger.error(`Find streams with pagination failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to fetch streams');
    }
  }

  async findOne(id: string, userId?: string, userRole?: UserRole): Promise<StreamResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid stream ID format');
    }

    const stream = await this.streamModel.findById(id).lean().exec();

    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Kiểm tra quyền xem stream
    if (stream.privacy === PrivacyStatus.PRIVATE) {
      if (!userId || userRole !== UserRole.ADMIN && stream.user_id.toString() !== userId) {
        throw new ForbiddenException('You do not have permission to view this private stream');
      }
    }

    return this.transformStreamResponse(stream);
  }

  async findByUser(userId: string): Promise<StreamResponse[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const streams = await this.streamModel
      .find({ user_id: new Types.ObjectId(userId), privacy: PrivacyStatus.PUBLIC })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return streams.map(stream => this.transformStreamResponse(stream));
  }

  async update(
    id: string, 
    updateStreamDto: UpdateStreamDto, 
    userId: string, 
    userRole: UserRole
  ): Promise<StreamResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid stream ID format');
    }

    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Kiểm tra quyền sửa stream
    if (userRole !== UserRole.ADMIN && stream.user_id.toString() !== userId) {
      throw new ForbiddenException('You can only update your own streams');
    }

    try {
      const updatedStream = await this.streamModel
        .findByIdAndUpdate(id, updateStreamDto, { new: true })
        .lean()
        .exec();

      if (!updatedStream) {
        throw new NotFoundException('Failed to update stream');
      }

      this.logger.log(`Stream updated successfully: ${id}`);
      return this.transformStreamResponse(updatedStream);
    } catch (error) {
      this.logger.error(`Update stream failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to update stream');
    }
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid stream ID format');
    }

    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Kiểm tra quyền xóa stream
    if (userRole !== UserRole.ADMIN && stream.user_id.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own streams');
    }

    try {
      const deletedStream = await this.streamModel.findByIdAndDelete(id).exec();
      if (!deletedStream) {
        throw new NotFoundException('Failed to delete stream');
      }

      this.logger.log(`Stream deleted successfully: ${id}`);
      return true;
    } catch (error) {
      this.logger.error(`Delete stream failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to delete stream');
    }
  }

  async endStream(id: string, userId: string, userRole: UserRole): Promise<StreamResponse> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid stream ID format');
    }

    const stream = await this.streamModel.findById(id).exec();
    if (!stream) {
      throw new NotFoundException('Stream not found');
    }

    // Kiểm tra quyền end stream
    if (userRole !== UserRole.ADMIN && stream.user_id.toString() !== userId) {
      throw new ForbiddenException('You can only end your own streams');
    }

    if (stream.status === Status.ENDED) {
      throw new BadRequestException('Stream has already ended');
    }

    try {
      const updatedStream = await this.streamModel
        .findByIdAndUpdate(id, { status: Status.ENDED }, { new: true })
        .lean()
        .exec();

      if (!updatedStream) {
        throw new NotFoundException('Failed to end stream');
      }

      this.logger.log(`Stream ended successfully: ${id}`);
      return this.transformStreamResponse(updatedStream);
    } catch (error) {
      this.logger.error(`End stream failed: ${error.message}`, error.stack);
      throw new BadRequestException('Failed to end stream');
    }
  }

  async getStreamStats(userId?: string): Promise<{
    totalStreams: number;
    liveStreams: number;
    endedStreams: number;
    publicStreams: number;
    privateStreams: number;
  }> {
    const filter = userId ? { user_id: new Types.ObjectId(userId) } : {};

    const [totalStreams, liveStreams, endedStreams, publicStreams, privateStreams] =
      await Promise.all([
        this.streamModel.countDocuments(filter),
        this.streamModel.countDocuments({ ...filter, status: Status.LIVE }),
        this.streamModel.countDocuments({ ...filter, status: Status.ENDED }),
        this.streamModel.countDocuments({ ...filter, privacy: PrivacyStatus.PUBLIC }),
        this.streamModel.countDocuments({ ...filter, privacy: PrivacyStatus.PRIVATE }),
      ]);

    return {
      totalStreams,
      liveStreams,
      endedStreams,
      publicStreams,
      privateStreams,
    };
  }

  /**
   * Transform stream document to response format with proper timestamps
   */
  private transformStreamResponse(stream: any): StreamResponse {
    return {
      _id: stream._id.toString(),
      user_id: stream.user_id.toString(),
      title: stream.title,
      description: stream.description,
      category: stream.category,
      status: stream.status,
      privacy: stream.privacy,
      thumbnail_url: stream.thumbnail_url,
      media_url: stream.media_url,
      createdAt: stream.createdAt,
      updatedAt: stream.updatedAt,
    };
  }
}
