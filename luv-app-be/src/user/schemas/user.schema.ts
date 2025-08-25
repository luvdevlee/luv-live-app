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

  @Prop({ required: true })
  password: string; // Not exposed in GraphQL

  @Field({ nullable: true })
  @Prop()
  avatar?: string;

  @Field()
  @Prop({ default: 'viewer' })
  displayName: string;

  @Field(() => UserRole)
  @Prop({ enum: UserRole, default: UserRole.VIEWER })
  role: UserRole;

  @Field()
  @Prop({ default: true })
  isActive: boolean;

  @Field({ nullable: true })
  @Prop()
  lastLoginAt?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);