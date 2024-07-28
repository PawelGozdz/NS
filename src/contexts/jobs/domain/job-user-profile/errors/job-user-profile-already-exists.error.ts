import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class JobUserProfileAlreadyExistsError extends DomainError {
  static withUserId(userId: EntityId, data?: DomainErrorOptions): JobUserProfileAlreadyExistsError {
    const message = `Entity with userId ${userId.value} already exists`;
    const options = {
      code: DomainErrorCode.DuplicateEntry,
      data,
    };
    return new JobUserProfileAlreadyExistsError(message, options);
  }
}
