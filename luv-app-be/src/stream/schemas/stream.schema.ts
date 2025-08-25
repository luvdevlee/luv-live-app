import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum StreamStatus {
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  ENDED = 'ended',
}

registerEnumType(StreamStatus, {
  name: 'StreamStatus',
  description: 'Stream status',
});

@ObjectType()
@Schema({ timestamps: true })
export class Stream {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Streamer', required: true })
  streamerId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field({ nullable: true })
  @Prop()
  thumbnail?: string;

  @Field()
  @Prop({ required: true })
  category: string;

  @Field(() => StreamStatus)
  @Prop({ enum: StreamStatus, default: StreamStatus.SCHEDULED })
  status: StreamStatus;

  @Field({ nullable: true })
  @Prop()
  scheduledAt?: Date;

  @Field({ nullable: true })
  @Prop()
  startedAt?: Date;

  @Field({ nullable: true })
  @Prop()
  endedAt?: Date;

  @Field()
  @Prop({ default: 0 })
  maxViewers: number;

  @Field()
  @Prop({ default: 0 })
  totalViewers: number;

  @Field({ nullable: true })
  @Prop({ unique: true })
  streamKey?: string;

  @Field({ nullable: true })
  @Prop()
  playbackUrl?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type StreamDocument = Stream & Document;
export const StreamSchema = SchemaFactory.createForClass(Stream);

// Indexes
StreamSchema.index({ streamerId: 1 });
StreamSchema.index({ status: 1 });
StreamSchema.index({ scheduledAt: 1 });
