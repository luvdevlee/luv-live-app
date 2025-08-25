import { IsString, MinLength, IsOptional } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStreamerDto {
  @Field()
  @IsString()
  @MinLength(2)
  stageName: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  bio?: string;
}
