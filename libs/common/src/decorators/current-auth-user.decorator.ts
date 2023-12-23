import { AuthUser } from '@app/authentication/models';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { NotFoundError } from '../errors';

export const GetCurrentAuthUser = createParamDecorator((_: string | undefined, context: ExecutionContext): AuthUser => {
	const request = context.switchToHttp().getRequest();

	const user = request.authUser as AuthUser;

	if (user) {
		return user;
	}

	throw new NotFoundError();
});
