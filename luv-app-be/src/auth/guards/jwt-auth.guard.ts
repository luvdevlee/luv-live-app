import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ConfigService } from '@nestjs/config';
import { REQUEST_USER_KEY } from '@src/common/constants';
import { ActiveUserData } from '@src/common/interfaces/active-user-data.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    // Xử lý cả HTTP và GraphQL context
    const request = this.getRequest(context);
    const token = this.getToken(request);
    if (!token) {
      throw new UnauthorizedException('Authorization token is required');
    }

    try {
      const payload = await this.jwtService.verifyAsync<ActiveUserData>(token, {
        secret: this.configService.get<string>('jwt.secret'),
      });

      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    return true;
  }

  // Thêm method để xử lý cả HTTP và GraphQL context
  private getRequest(context: ExecutionContext): Request {
    const contextType = context.getType<string>();

    if (contextType === 'graphql') {
      const gqlContext = GqlExecutionContext.create(context);
      return gqlContext.getContext().req;
    }

    // HTTP context
    return context.switchToHttp().getRequest();
  }

  private getToken(request: Request) {
    const [_, token] = request.headers?.authorization?.split(' ') ?? [];
    return token;
  }
}
