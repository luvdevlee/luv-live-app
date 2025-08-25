import { IsString, MinLength, IsOptional, IsBoolean } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateStreamerDto {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  stageName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;
}
