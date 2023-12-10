import { ApplicationError, ApplicationErrorCode, ApplicationErrorOptions, ValidationApplicationError } from '@libs/common/errors';

export class CannotCreateUserError extends ApplicationError {
	static failed(data?: ApplicationErrorOptions): ValidationApplicationError {
		const message = data?.message || 'Cannot create user';
		const options = {
			code: ApplicationErrorCode.Unavailable,
			data,
		};
		return new CannotCreateUserError(message, options);
	}
}
