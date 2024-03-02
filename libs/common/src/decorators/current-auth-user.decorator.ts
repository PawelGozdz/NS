import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundError } from '../errors';
import { IAuthUserModel } from '../models';
import { AppUtils } from '../utils';

export const GetCurrentAuthUser = createParamDecorator((_: string | undefined, context: ExecutionContext): IAuthUserModel => {
  const request = context.switchToHttp().getRequest();

  const user = request.authUser as IAuthUserModel;

  if (AppUtils.hasValue(user)) {
    return user;
  }

  throw new NotFoundError();
});
