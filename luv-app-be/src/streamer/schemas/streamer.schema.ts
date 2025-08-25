import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Schema({ timestamps: true })
export class Streamer {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Field()
  @Prop({ required: true })
  stageName: string;

  @Field({ nullable: true })
  @Prop()
  bio?: string;

  @Field()
  @Prop({ default: false })
  isVerified: boolean;

  @Field()
  @Prop({ default: 0 })
  totalFollowers: number;

  @Field()
  @Prop({ default: 0 })
  totalViews: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type StreamerDocument = Streamer & Document;
export const StreamerSchema = SchemaFactory.createForClass(Streamer);

// Indexes
StreamerSchema.index({ userId: 1 });
StreamerSchema.index({ stageName: 1 });
