import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthUser } from '@app/contexts';
import { AppUtils, NotFoundError } from '@libs/common';

export const GetCurrentAuthUser = createParamDecorator((_: string | undefined, context: ExecutionContext): AuthUser => {
  const request = context.switchToHttp().getRequest();

  const user = request?.user;

  if (AppUtils.hasValue(user)) {
    return user as AuthUser;
  }

  throw new NotFoundError();
});
