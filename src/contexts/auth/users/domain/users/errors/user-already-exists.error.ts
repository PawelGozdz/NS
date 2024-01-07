import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class UserAlreadyExistsError extends DomainError {
	static withEmail(email: string, data?: DomainErrorOptions): UserAlreadyExistsError {
		const message = `Entity with email ${email} already exists`;
		const options = {
			code: DomainErrorCode.DuplicateEntry,
			data,
		};
		return new UserAlreadyExistsError(message, options);
	}
}
