import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class SkillAlreadyExistsError extends DomainError {
  static withNameAndCategoryId(name: string, categoryId: number, data?: DomainErrorOptions): SkillAlreadyExistsError {
    const message = `Entity with name ${name} and categoryId ${categoryId} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new SkillAlreadyExistsError(message, options);
  }

  static withId(id: number, data?: DomainErrorOptions): SkillAlreadyExistsError {
    const message = `Entity with id ${id} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new SkillAlreadyExistsError(message, options);
  }
}
