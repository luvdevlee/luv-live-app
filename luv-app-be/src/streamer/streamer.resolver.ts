import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { StreamerService } from './streamer.service';
import { Streamer } from './schemas/streamer.schema';
import { CreateStreamerDto } from './dto/create-streamer.dto';
import { UpdateStreamerDto } from './dto/update-streamer.dto';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';

@Resolver(() => Streamer)
export class StreamerResolver {
  constructor(
    private readonly streamerService: StreamerService,
    private readonly userService: UserService,
  ) {}

  @Mutation(() => Streamer)
  createStreamer(
    @Args('userId', { type: () => String }) userId: string,
    @Args('createStreamerDto') createStreamerDto: CreateStreamerDto,
  ) {
    return this.streamerService.create(userId, createStreamerDto);
  }

  @Query(() => [Streamer], { name: 'streamers' })
  findAll() {
    return this.streamerService.findAll();
  }

  @Query(() => Streamer, { name: 'streamer' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.streamerService.findOne(id);
  }

  @Query(() => Streamer, { name: 'streamerByUserId' })
  findByUserId(@Args('userId', { type: () => String }) userId: string) {
    return this.streamerService.findByUserId(userId);
  }

  @Query(() => Streamer, { name: 'streamerByStageName' })
  findByStageName(
    @Args('stageName', { type: () => String }) stageName: string,
  ) {
    return this.streamerService.findByStageName(stageName);
  }

  @Query(() => [Streamer], { name: 'verifiedStreamers' })
  findVerifiedStreamers() {
    return this.streamerService.findVerifiedStreamers();
  }

  @Mutation(() => Streamer)
  updateStreamer(
    @Args('id', { type: () => String }) id: string,
    @Args('updateStreamerDto') updateStreamerDto: UpdateStreamerDto,
  ) {
    return this.streamerService.update(id, updateStreamerDto);
  }

  @Mutation(() => Streamer)
  removeStreamer(@Args('id', { type: () => String }) id: string) {
    return this.streamerService.remove(id);
  }

  @Mutation(() => Streamer)
  verifyStreamer(@Args('id', { type: () => String }) id: string) {
    return this.streamerService.verifyStreamer(id);
  }

  @ResolveField(() => User, { name: 'user' })
  async getUser(@Parent() streamer: Streamer) {
    return this.userService.findOne(streamer.userId.toString());
  }
}
