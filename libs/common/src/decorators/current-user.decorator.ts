import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../entities';
import { NotFoundError } from '../errors';

export const GetCurrentUser = createParamDecorator((_: string | undefined, context: ExecutionContext): IUser => {
	const request = context.switchToHttp().getRequest();

	const user = request.user as IUser;

	if (user) {
		return user;
	}

	throw new NotFoundError();
});
