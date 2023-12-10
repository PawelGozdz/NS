import { UnauthorizedError } from '@libs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const GetRefreshToken = createParamDecorator((_: undefined, context: ExecutionContext): string => {
	const request = context.switchToHttp().getRequest() as Request;

	const token = request.refresh_token;

	if (token) {
		return token;
	}

	throw new UnauthorizedError();
});
