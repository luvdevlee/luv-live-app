import { 
  Resolver, 
  Query, 
  Mutation, 
  Args, 
  ResolveField, 
  Parent,
  Int 
} from '@nestjs/graphql';
import { 
  UseGuards, 
  UnauthorizedException, 
  BadRequestException,
  ForbiddenException 
} from '@nestjs/common';
import { StreamService } from './stream.service';
import { UserService } from '@src/user/user.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { StreamResponse } from './dto/stream.response';
import { StreamsQueryDto } from './dto/streams-query.dto';
import { StreamsPaginatedResponse } from './dto/streams-paginated.response';
import { UserResponse } from '@src/user/dto/user.response';
import { CurrentUser } from '@src/common/decorators/current-user.decorator';
import { JwtAuthGuard } from '@src/auth/guards/jwt-auth.guard';
import { Public } from '@src/common/decorators/public.decorator';
import { UserRole } from '@src/user/schemas/user.schema';
import type { AuthUser } from '@src/user/dto/auth-user.dto';

@Resolver(() => StreamResponse)
export class StreamResolver {
  constructor(
    private readonly streamService: StreamService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => StreamResponse, {
    description: 'Create a new stream (streamers and admins only)',
  })
  async createStream(
    @Args('createStreamDto') createStreamDto: CreateStreamDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamResponse> {
    return this.streamService.create(createStreamDto, currentUser.sub);
  }

  @Public()
  @Query(() => StreamsPaginatedResponse, {
    name: 'streams',
    description: 'Get streams with pagination and filtering (public)',
  })
  async findAllPaginated(
    @Args('query', { type: () => StreamsQueryDto, nullable: true }) 
    query: StreamsQueryDto = new StreamsQueryDto(),
  ): Promise<StreamsPaginatedResponse> {
    return this.streamService.findAllPaginated(query);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => StreamsPaginatedResponse, {
    name: 'streamsAdmin',
    description: 'Get all streams with admin permissions (admin only)',
  })
  async findAllPaginatedAdmin(
    @Args('query', { type: () => StreamsQueryDto, nullable: true }) 
    query: StreamsQueryDto = new StreamsQueryDto(),
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamsPaginatedResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can access all streams');
    }

    return this.streamService.findAllPaginatedWithPermission(
      query, 
      currentUser.sub, 
      currentUser.role
    );
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => StreamsPaginatedResponse, {
    name: 'myStreams', 
    description: 'Get current user streams',
  })
  async findMyStreams(
    @Args('query', { type: () => StreamsQueryDto, nullable: true }) 
    query: StreamsQueryDto = new StreamsQueryDto(),
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamsPaginatedResponse> {
    return this.streamService.findMyStreams(currentUser.sub, query);
  }

  @Public()
  @Query(() => [StreamResponse], {
    name: 'streamsSimple',
    description: 'Get simple list of public live streams (for backward compatibility)',
  })
  async findAllSimple(): Promise<StreamResponse[]> {
    const result = await this.streamService.findAllPaginated({
      page: 1,
      limit: 50,
      status: 'live' as any,
      privacy: 'public' as any,
    });
    return result.streams;
  }

  @Public()
  @Query(() => StreamResponse, {
    name: 'stream',
    description: 'Get stream by ID',
  })
  async findById(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser?: AuthUser,
  ): Promise<StreamResponse> {
    return this.streamService.findOne(
      id, 
      currentUser?.sub, 
      currentUser?.role
    );
  }

  @Public()
  @Query(() => [StreamResponse], {
    name: 'streamsByUser',
    description: 'Get public streams by user ID',
  })
  async findByUser(
    @Args('userId', { type: () => String }) userId: string,
  ): Promise<StreamResponse[]> {
    return this.streamService.findByUser(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => StreamResponse, {
    description: 'Update stream (owner and admin only)',
  })
  async updateStream(
    @Args('id', { type: () => String }) id: string,
    @Args('updateStreamDto') updateStreamDto: UpdateStreamDto,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamResponse> {
    return this.streamService.update(
      id, 
      updateStreamDto, 
      currentUser.sub, 
      currentUser.role
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean, {
    description: 'Delete stream (owner and admin only)',
  })
  async removeStream(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<boolean> {
    return this.streamService.remove(id, currentUser.sub, currentUser.role);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => StreamResponse, {
    description: 'End stream (owner and admin only)',
  })
  async endStream(
    @Args('id', { type: () => String }) id: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamResponse> {
    return this.streamService.endStream(id, currentUser.sub, currentUser.role);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => StreamStatsResponse, {
    name: 'streamStats',
    description: 'Get stream statistics',
  })
  async getStreamStats(
    @Args('userId', { type: () => String, nullable: true }) userId: string,
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamStatsResponse> {
    // Nếu là admin, có thể xem stats của bất kỳ user nào
    // Nếu không, chỉ có thể xem stats của chính mình
    const targetUserId = userId 
      ? (currentUser.role === UserRole.ADMIN || currentUser.sub === userId ? userId : currentUser.sub)
      : currentUser.sub;

    const stats = await this.streamService.getStreamStats(targetUserId);
    return stats;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => StreamStatsResponse, {
    name: 'globalStreamStats',
    description: 'Get global stream statistics (admin only)',
  })
  async getGlobalStreamStats(
    @CurrentUser() currentUser: AuthUser,
  ): Promise<StreamStatsResponse> {
    if (currentUser.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('Only admins can access global stats');
    }

    const stats = await this.streamService.getStreamStats();
    return stats;
  }

  // Field Resolver để populate user thông tin
  @ResolveField(() => UserResponse, { nullable: true })
  async user(@Parent() stream: StreamResponse): Promise<UserResponse | null> {
    try {
      return await this.userService.findOne(stream.user_id);
    } catch (error) {
      // Nếu user không tồn tại, trả về null thay vì throw error
      return null;
    }
  }
}

// Response type cho stream statistics
import { ObjectType, Field } from '@nestjs/graphql';
import { Stream } from './schemas/stream.schema';

@ObjectType()
export class StreamStatsResponse {
  @Field(() => Int)
  totalStreams: number;

  @Field(() => Int)
  liveStreams: number;

  @Field(() => Int)
  endedStreams: number;

  @Field(() => Int)
  publicStreams: number;

  @Field(() => Int)
  privateStreams: number;
}
