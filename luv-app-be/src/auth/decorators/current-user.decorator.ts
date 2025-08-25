import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    if (context.getType() === ('graphql' as any)) {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req.user;
    }
    // For REST endpoints
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
