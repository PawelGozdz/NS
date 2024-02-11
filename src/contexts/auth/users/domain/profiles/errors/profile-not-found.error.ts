import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class ProfileNotFoundError extends DomainError {
	static withEntityId(id: EntityId, data?: DomainErrorOptions): ProfileNotFoundError {
		const message = `Entity with id ${id} doesn't exists`;
		const options = {
			code: DomainErrorCode.NotFound,
			data,
		};
		return new ProfileNotFoundError(message, options);
	}

	static withUserId(userId: EntityId, data?: DomainErrorOptions): ProfileNotFoundError {
		const message = `Entity with userId ${userId.value} doesn't exists`;
		const options = {
			code: DomainErrorCode.NotFound,
			data,
		};
		return new ProfileNotFoundError(message, options);
	}
}
