import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundError } from '../errors';
import { AppUtils } from '../utils';

export const GetCurrentUser = createParamDecorator((_: string | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const { user } = request;

  if (AppUtils.hasValue(user)) {
    return user;
  }

  throw new NotFoundError();
});
