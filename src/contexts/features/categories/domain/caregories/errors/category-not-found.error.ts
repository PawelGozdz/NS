import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class CategoryNotFoundError extends DomainError {
  static withId(id: number, data?: DomainErrorOptions): CategoryNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new CategoryNotFoundError(message, options);
  }
}
