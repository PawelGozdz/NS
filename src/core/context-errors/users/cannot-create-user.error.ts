import { ApplicationError, ApplicationErrorOptions, UserErrorCode, ValidationApplicationError } from '@libs/common';

export class CannotCreateUserError extends ApplicationError {
	static failed(data?: ApplicationErrorOptions): ValidationApplicationError {
		const message = data?.message || 'Cannot create user';
		const options = {
			code: UserErrorCode.CannotCreate,
			data,
		};
		return new CannotCreateUserError(message, options);
	}
}
