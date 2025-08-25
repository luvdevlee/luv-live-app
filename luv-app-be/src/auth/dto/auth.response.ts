import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '@src/user/schemas/user.schema';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field(() => User)
  user: User;
}
