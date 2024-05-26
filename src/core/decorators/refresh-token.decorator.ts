import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { UnauthorizedError } from '@libs/common';

export const GetRefreshToken = createParamDecorator((_: undefined, context: ExecutionContext): string => {
  const request = context.switchToHttp().getRequest();

  const token: string = request?.refreshToken;

  if (token) {
    return token;
  }

  throw new UnauthorizedError();
});
