import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsEnum,
  IsBoolean,
  Matches,
  IsStrongPassword,
} from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';
import { UserRole } from '../schemas/user.schema';

@InputType()
export class CreateUserDto {
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

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  google_id?: string;

  @Field({ nullable: true })
  @IsOptional()
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
  avatar_url?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  display_name?: string;

  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Role must be a valid user role' })
  role?: UserRole;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
