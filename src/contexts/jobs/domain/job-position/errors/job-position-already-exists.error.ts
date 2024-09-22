import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class JobPositionAlreadyExistsError extends DomainError {
  static withSlugAndCategoryId(slug: string, categoryId: number, data?: DomainErrorOptions): JobPositionAlreadyExistsError {
    const message = `Entity with title ${slug} and categoryId ${categoryId} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobPositionAlreadyExistsError(message, options);
  }

  static withId(id: EntityId, data?: DomainErrorOptions): JobPositionAlreadyExistsError {
    const message = `Entity with id ${id.value} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobPositionAlreadyExistsError(message, options);
  }
}
