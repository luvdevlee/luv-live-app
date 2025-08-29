import { IsString, IsStrongPassword } from 'class-validator';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ChangePasswordDto {
  @Field()
  @IsString()
  oldPassword: string;

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
        'New password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
    },
  )
  newPassword: string;
}
