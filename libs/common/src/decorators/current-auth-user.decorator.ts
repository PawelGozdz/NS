import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IAuthUser } from '../entities';
import { NotFoundError } from '../errors';

export const GetCurrentAuthUser = createParamDecorator((_: string | undefined, context: ExecutionContext): IAuthUser => {
	const request = context.switchToHttp().getRequest();

	const user = request.authUser as IAuthUser;

	if (user) {
		return user;
	}

	throw new NotFoundError();
});
