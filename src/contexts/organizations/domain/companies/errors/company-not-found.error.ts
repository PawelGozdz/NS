import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class CompanyNotFoundError extends DomainError {
  static withEntityId(id: EntityId, data?: DomainErrorOptions): CompanyNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new CompanyNotFoundError(message, options);
  }
}
