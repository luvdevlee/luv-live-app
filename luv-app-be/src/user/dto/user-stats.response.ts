import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class UserStatsResponse {
  @Field(() => Int)
  totalUsers: number;

  @Field(() => Int)
  activeUsers: number;

  @Field(() => Int)
  streamers: number;

  @Field(() => Int)
  viewers: number;

  @Field(() => Int)
  admins: number;
}
