import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class JobPositionAlreadyExistsError extends DomainError {
  static withTitleAndCategoryId(title: string, categoryId: number, data?: DomainErrorOptions): JobPositionAlreadyExistsError {
    const message = `Entity with title ${title} and categoryId ${categoryId} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobPositionAlreadyExistsError(message, options);
  }

  static withId(id: number, data?: DomainErrorOptions): JobPositionAlreadyExistsError {
    const message = `Entity with id ${id} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobPositionAlreadyExistsError(message, options);
  }
}
