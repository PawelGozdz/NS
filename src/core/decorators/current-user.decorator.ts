import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AppUtils, NotFoundError } from '@libs/common';

import { IUser } from '../interfaces';

export const GetCurrentUser = createParamDecorator((_: string | undefined, context: ExecutionContext): IUser => {
  const request = context.switchToHttp().getRequest();

  const user = request?.userData;

  if (AppUtils.hasValue(user)) {
    return user as IUser;
  }

  throw new NotFoundError();
});
