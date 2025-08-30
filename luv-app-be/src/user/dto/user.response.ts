import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '../schemas/user.schema';

@ObjectType()
export class UserResponse {
  @Field(() => ID)
  _id: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  google_id?: string;

  @Field({ nullable: true })
  avatar_url?: string;

  @Field({ nullable: true })
  display_name?: string;

  @Field(() => UserRole)
  role: UserRole;

  @Field()
  is_active: boolean;

  @Field({ nullable: true })
  last_login_at?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
