import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class CompanyAlreadyExistsError extends DomainError {
  static withEntityId(id: EntityId, data?: DomainErrorOptions): CompanyAlreadyExistsError {
    const message = `Entity with id ${id.value} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new CompanyAlreadyExistsError(message, options);
  }
}
