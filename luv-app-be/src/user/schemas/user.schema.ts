import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'admin',
  STREAMER = 'streamer',
  VIEWER = 'viewer',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'User roles in the system',
});

@ObjectType()
@Schema({ timestamps: true })
export class User {
  @Field(() => ID)
  _id: string;

  @Field()
  @Prop({ required: true, unique: true })
  username: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field({ nullable: true })
  @Prop({ unique: true, sparse: true })
  google_id?: string;

  @Prop({ required: false })
  password_hash?: string; // Not exposed in GraphQL, make optional for Google users

  @Field({ nullable: true })
  @Prop()
  avatar_url?: string;

  @Field({ nullable: true })
  @Prop({ default: 'viewer' })
  display_name?: string;

  @Field(() => UserRole)
  @Prop({ enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Field()
  @Prop({ default: true })
  is_active: boolean;

  @Field({ nullable: true })
  @Prop()
  last_login_at?: Date;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes for better performance
UserSchema.index({ email: 1 }, { unique: true, sparse: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ google_id: 1 }, { unique: true, sparse: true });
UserSchema.index({ role: 1 });
UserSchema.index({ is_active: 1 });
UserSchema.index({ created_at: -1 });
UserSchema.index({ last_login_at: -1 });

// Compound indexes for common queries
UserSchema.index({ email: 1, is_active: 1 });
UserSchema.index({ username: 1, is_active: 1 });
UserSchema.index({ role: 1, is_active: 1 });
