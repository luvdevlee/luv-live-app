import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Status, PrivacyStatus } from '../schemas/stream.schema';
import { UserResponse } from '@src/user/dto/user.response';

@ObjectType()
export class StreamResponse {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  user_id: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  category?: string;

  @Field(() => Status)
  status: Status;

  @Field(() => PrivacyStatus)
  privacy: PrivacyStatus;

  @Field({ nullable: true })
  thumbnail_url?: string;

  @Field({ nullable: true })
  media_url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => UserResponse, { nullable: true })
  user?: UserResponse;
}
