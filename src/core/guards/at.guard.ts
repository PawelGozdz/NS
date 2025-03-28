import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic: true | undefined = this.reflector.getAllAndOverride('isPublic', [context.getHandler(), context.getClass()]);

    if (isPublic) return true;

    return super.canActivate(context);
  }
}
