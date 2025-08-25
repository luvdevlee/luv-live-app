import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const handler = context.getHandler();

    if (handler.name && handler.name.includes('Resolver')) {
      const ctx = GqlExecutionContext.create(context);
      return ctx.getContext().req;
    }

    // For REST endpoints
    return context.switchToHttp().getRequest();
  }
}
