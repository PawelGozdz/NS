import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IUser } from '../entities';

export const GetCurrentUser = createParamDecorator((data: string | undefined, context: ExecutionContext): IUser => {
	const request = context.switchToHttp().getRequest();

	if (!data) return request.user;
	return request?.user[data];
});
