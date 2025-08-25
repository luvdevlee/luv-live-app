import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StreamerResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  stageName: string;

  @Field({ nullable: true })
  bio?: string;

  @Field()
  isVerified: boolean;

  @Field()
  totalFollowers: number;

  @Field()
  totalViews: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
