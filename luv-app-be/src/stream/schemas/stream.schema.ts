import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum Status {
  LIVE = 'live',
  ENDED = 'ended',
}

export enum PrivacyStatus {
  PUBLIC = 'public',
  PRIVATE = 'private',
}

registerEnumType(Status, {
  name: 'Status',
  description: 'Stream status - live or ended',
});

registerEnumType(PrivacyStatus, {
  name: 'PrivacyStatus', 
  description: 'Stream privacy - public or private',
});

@ObjectType()
@Schema({ timestamps: true })
export class Stream {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user_id: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  title: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;
  
  @Field({ nullable: true })
  @Prop({ required: true })
  category?: string;

  @Field(() => Status)
  @Prop({ enum: Status, default: Status.LIVE })
  status: Status;

  @Field(() => PrivacyStatus)
  @Prop({ enum: PrivacyStatus, default: PrivacyStatus.PUBLIC })
  privacy: PrivacyStatus;

  @Field({ nullable: true })
  @Prop()
  thumbnail_url?: string;

  @Field({ nullable: true })
  @Prop()
  media_url?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type StreamDocument = Stream & Document;
export const StreamSchema = SchemaFactory.createForClass(Stream);

// Indexes
StreamSchema.index({ user_id: 1 });
StreamSchema.index({ status: 1 });
StreamSchema.index({ privacy: 1 });
StreamSchema.index({ createdAt: -1 });
StreamSchema.index({ updatedAt: -1 });
