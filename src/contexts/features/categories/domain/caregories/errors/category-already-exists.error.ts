import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class CategoryAlreadyExistsError extends DomainError {
	static withNameAndContext(name: string, context: string, data?: DomainErrorOptions): CategoryAlreadyExistsError {
		const message = `Entity with name ${name} and context ${context} already exists`;
		const options = {
			code: DomainErrorCode.DuplicateEntry,
			data,
		};
		return new CategoryAlreadyExistsError(message, options);
	}

	static withId(id: number, data?: DomainErrorOptions): CategoryAlreadyExistsError {
		const message = `Entity with id ${id} already exists`;
		const options = {
			code: DomainErrorCode.DuplicateEntry,
			data,
		};
		return new CategoryAlreadyExistsError(message, options);
	}
}
