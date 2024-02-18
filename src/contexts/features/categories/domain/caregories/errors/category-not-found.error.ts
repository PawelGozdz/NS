import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class CategoryNotFoundError extends DomainError {
	static withEntityId(id: EntityId, data?: DomainErrorOptions): CategoryNotFoundError {
		const message = `Entity with id ${id} doesn't exists`;
		const options = {
			code: DomainErrorCode.NotFound,
			data,
		};
		return new CategoryNotFoundError(message, options);
	}
}
