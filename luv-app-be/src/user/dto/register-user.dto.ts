import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsStrongPassword,
  IsOptional,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterUserDto {
  @Field()
  @IsString()
  @MinLength(3, { message: 'Username must be at least 3 characters long' })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  username: string;

  @Field()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @Field()
  @IsStrongPassword(
    {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    },
    {
      message:
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  display_name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  avatar_url?: string;
}
