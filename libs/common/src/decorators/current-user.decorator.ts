import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../entities';
import { NotFoundError } from '../errors';

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext): IUser => {
	const request = context.switchToHttp().getRequest();

	const user = request.user;

	if (user) {
		return user;
	}

	throw new NotFoundError();
});
