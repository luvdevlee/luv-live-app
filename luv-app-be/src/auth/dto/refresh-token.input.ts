import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class RefreshTokenInput {
  @Field()
  @IsNotEmpty({ message: 'Refresh token cannot be empty' })
  @IsString({ message: 'Refresh token must be a string' })
  refresh_token: string;
}
