import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { NotFoundError } from '../errors';
import { IUserModel } from '../models';

export const GetCurrentUser = createParamDecorator((_: string | undefined, context: ExecutionContext): IUserModel => {
	const request = context.switchToHttp().getRequest();

	const user = request.user as IUserModel;

	if (user) {
		return user;
	}

	throw new NotFoundError();
});
