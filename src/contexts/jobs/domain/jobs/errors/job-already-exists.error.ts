import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class JobAlreadyExistsError extends DomainError {
  static withUserId(userId: EntityId, data?: DomainErrorOptions): JobAlreadyExistsError {
    const message = `Entity with userId ${userId.value} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobAlreadyExistsError(message, options);
  }
}
