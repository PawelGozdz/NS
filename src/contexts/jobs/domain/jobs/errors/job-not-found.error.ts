import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class JobNotFoundError extends DomainError {
  static withEntityId(id: EntityId, data?: DomainErrorOptions): JobNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new JobNotFoundError(message, options);
  }
}
