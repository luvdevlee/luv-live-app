import { ObjectType, Field } from '@nestjs/graphql';
import { StreamResponse } from './stream.response';
import { PaginationMeta } from '@src/user/dto/users-paginated.response';

@ObjectType()
export class StreamsPaginatedResponse {
  @Field(() => [StreamResponse])
  streams: StreamResponse[];

  @Field(() => PaginationMeta)
  meta: PaginationMeta;
}
