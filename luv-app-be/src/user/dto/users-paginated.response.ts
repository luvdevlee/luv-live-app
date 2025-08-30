import { ObjectType, Field, Int } from '@nestjs/graphql';
import { UserResponse } from './user.response';

@ObjectType()
export class PaginationMeta {
  @Field(() => Int)
  currentPage: number;

  @Field(() => Int)
  totalPages: number;

  @Field(() => Int)
  totalCount: number;

  @Field(() => Int)
  limit: number;

  @Field()
  hasNext: boolean;

  @Field()
  hasPrev: boolean;
}

@ObjectType()
export class UsersPaginatedResponse {
  @Field(() => [UserResponse])
  users: UserResponse[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
