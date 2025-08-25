import { ObjectType, Field, ID } from '@nestjs/graphql';
import { StreamStatus } from '../schemas/stream.schema';

@ObjectType()
export class StreamResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  streamerId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field()
  category: string;

  @Field(() => StreamStatus)
  status: StreamStatus;

  @Field({ nullable: true })
  scheduledAt?: Date;

  @Field({ nullable: true })
  startedAt?: Date;

  @Field({ nullable: true })
  endedAt?: Date;

  @Field()
  maxViewers: number;

  @Field()
  totalViewers: number;

  @Field({ nullable: true })
  streamKey?: string;

  @Field({ nullable: true })
  playbackUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
