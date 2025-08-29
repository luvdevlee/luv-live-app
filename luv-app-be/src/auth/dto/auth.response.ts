import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '@src/user/schemas/user.schema';

@ObjectType()
export class AuthResponse {
  @Field()
  access_token: string;

  @Field()
  refresh_token: string;

  @Field(() => User)
  user: User;
}

@ObjectType()
export class LogoutResponse {
  @Field()
  message: string;

  @Field()
  success: boolean;
}

@ObjectType()
export class RefreshTokenResponse {
  @Field()
  access_token: string;
}
