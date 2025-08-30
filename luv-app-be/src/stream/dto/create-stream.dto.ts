import {
  IsString,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { Status, PrivacyStatus } from '../schemas/stream.schema';

@InputType()
export class CreateStreamDto {
  @Field()
  @IsString()
  @MinLength(3, { message: 'Stream title must be at least 3 characters long' })
  @MaxLength(200, { message: 'Stream title must not exceed 200 characters' })
  title: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Description must not exceed 1000 characters' })
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Category must not exceed 50 characters' })
  category?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status, { message: 'Status must be a valid stream status' })
  status?: Status;

  @Field(() => PrivacyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PrivacyStatus, { message: 'Privacy must be a valid privacy status' })
  privacy?: PrivacyStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid thumbnail URL' })
  thumbnail_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Please provide a valid media URL' })
  media_url?: string;
}
