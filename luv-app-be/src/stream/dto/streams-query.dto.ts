import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsInt, Min, Max, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { Status, PrivacyStatus } from '../schemas/stream.schema';

@InputType()
export class StreamsQueryDto {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number = 10;

  @Field({ nullable: true, description: 'Search by title, description, category' })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => Status, { nullable: true })
  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @Field(() => PrivacyStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PrivacyStatus)
  privacy?: PrivacyStatus;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  user_id?: string;

  @Field({ nullable: true, description: 'Sort by: createdAt, updatedAt, title' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @Field({ nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
