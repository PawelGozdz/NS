import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class SkillNotFoundError extends DomainError {
  static withId(id: number, data?: DomainErrorOptions): SkillNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new SkillNotFoundError(message, options);
  }

  static withCategoryId(categoryId: number, data?: DomainErrorOptions): SkillNotFoundError {
    const message = `Category with id ${categoryId} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new SkillNotFoundError(message, options);
  }
}
