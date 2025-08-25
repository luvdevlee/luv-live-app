import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Follower {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  followerId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Streamer', required: true })
  streamerId: Types.ObjectId;

  @Field()
  @Prop({ default: Date.now })
  followedAt: Date;
}

export type FollowerDocument = Follower & Document;
export const FollowerSchema = SchemaFactory.createForClass(Follower);

// Compound unique index
FollowerSchema.index({ followerId: 1, streamerId: 1 }, { unique: true });
FollowerSchema.index({ streamerId: 1 });
