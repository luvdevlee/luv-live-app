import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { StreamService } from './stream.service';
import { CreateStreamDto } from './dto/create-stream.dto';
import { UpdateStreamDto } from './dto/update-stream.dto';
import { StreamResponse } from './dto/stream.response';
import { Streamer } from '../streamer/schemas/streamer.schema';
import { StreamerService } from '../streamer/streamer.service';

@Resolver(() => StreamResponse)
export class StreamResolver {
  constructor(
    private readonly streamService: StreamService,
    private readonly streamerService: StreamerService,
  ) {}

  @Mutation(() => StreamResponse)
  createStream(
    @Args('streamerId', { type: () => String }) streamerId: string,
    @Args('createStreamDto') createStreamDto: CreateStreamDto,
  ) {
    return this.streamService.create(streamerId, createStreamDto);
  }

  @Query(() => [StreamResponse], { name: 'streams' })
  findAll() {
    return this.streamService.findAll();
  }

  @Query(() => StreamResponse, { name: 'stream' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.streamService.findOne(id);
  }

  @Query(() => [StreamResponse], { name: 'streamsByStreamer' })
  findByStreamerId(
    @Args('streamerId', { type: () => String }) streamerId: string,
  ) {
    return this.streamService.findByStreamerId(streamerId);
  }

  @Query(() => [StreamResponse], { name: 'liveStreams' })
  findLiveStreams() {
    return this.streamService.findLiveStreams();
  }

  @Query(() => [StreamResponse], { name: 'scheduledStreams' })
  findScheduledStreams() {
    return this.streamService.findScheduledStreams();
  }

  @Query(() => [StreamResponse], { name: 'streamsByCategory' })
  findByCategory(@Args('category', { type: () => String }) category: string) {
    return this.streamService.findByCategory(category);
  }

  @Mutation(() => StreamResponse)
  updateStream(
    @Args('id', { type: () => String }) id: string,
    @Args('updateStreamDto') updateStreamDto: UpdateStreamDto,
  ) {
    return this.streamService.update(id, updateStreamDto);
  }

  @Mutation(() => StreamResponse)
  removeStream(@Args('id', { type: () => String }) id: string) {
    return this.streamService.remove(id);
  }

  @Mutation(() => StreamResponse)
  startStream(@Args('id', { type: () => String }) id: string) {
    return this.streamService.startStream(id);
  }

  @Mutation(() => StreamResponse)
  endStream(@Args('id', { type: () => String }) id: string) {
    return this.streamService.endStream(id);
  }

  @Mutation(() => StreamResponse)
  setPlaybackUrl(
    @Args('id', { type: () => String }) id: string,
    @Args('playbackUrl', { type: () => String }) playbackUrl: string,
  ) {
    return this.streamService.setPlaybackUrl(id, playbackUrl);
  }

  @ResolveField(() => Streamer, { name: 'streamer' })
  async getStreamer(@Parent() stream: StreamResponse) {
    return this.streamerService.findOne(stream.streamerId.toString());
  }
}
