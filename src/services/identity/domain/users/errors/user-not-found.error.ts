import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class UserNotFoundError extends DomainError {
	static withEntityId(id: EntityId, data?: DomainErrorOptions): UserNotFoundError {
		const message = `Entity with id ${id} doesn't exists`;
		const options = {
			code: DomainErrorCode.DuplicateEntry,
			data,
		};
		return new UserNotFoundError(message, options);
	}

	static withEntityEmail(email: string, data?: DomainErrorOptions): UserNotFoundError {
		const message = `Entity with email ${email} doesn't exists`;
		const options = {
			code: DomainErrorCode.DuplicateEntry,
			data,
		};
		return new UserNotFoundError(message, options);
	}
}
