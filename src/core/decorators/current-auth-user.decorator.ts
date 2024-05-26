import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundError } from '../../../libs/common/src/errors';
import { AppUtils } from '../../../libs/common/src/utils';

export const GetCurrentAuthUser = createParamDecorator((_: string | undefined, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();

  const user = request.authUser;

  if (AppUtils.hasValue(user)) {
    return user;
  }

  throw new NotFoundError();
});
