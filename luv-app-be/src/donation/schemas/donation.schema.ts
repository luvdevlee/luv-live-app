import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum DonationStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

registerEnumType(DonationStatus, {
  name: 'DonationStatus',
  description: 'Donation status',
});

@ObjectType()
@Schema({ timestamps: true })
export class Donation {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Stream', required: true })
  streamId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  donorId: Types.ObjectId;

  @Field(() => ID)
  @Prop({ type: Types.ObjectId, ref: 'Streamer', required: true })
  streamerId: Types.ObjectId;

  @Field()
  @Prop({ required: true, type: Number })
  amount: number;

  @Field({ nullable: true })
  @Prop()
  message?: string;

  @Field(() => DonationStatus)
  @Prop({ enum: DonationStatus, default: DonationStatus.PENDING })
  status: DonationStatus;

  @Field()
  @Prop({ default: Date.now })
  createdAt: Date;
}

export type DonationDocument = Donation & Document;
export const DonationSchema = SchemaFactory.createForClass(Donation);

// Indexes
DonationSchema.index({ streamId: 1 });
DonationSchema.index({ donorId: 1 });
DonationSchema.index({ streamerId: 1 });
