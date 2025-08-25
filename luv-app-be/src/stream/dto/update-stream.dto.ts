import { IsString, MinLength, IsOptional, IsDateString } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateStreamDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  category?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  scheduledAt?: string;
}
