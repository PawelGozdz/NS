import { DomainError, DomainErrorCode, DomainErrorOptions, EntityId } from '@libs/common';

export class JobUserProfileNotFoundError extends DomainError {
  static withEntityId(id: EntityId, data?: DomainErrorOptions): JobUserProfileNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new JobUserProfileNotFoundError(message, options);
  }

  static withEntityUserId(userId: EntityId, data?: DomainErrorOptions): JobUserProfileNotFoundError {
    const message = `Entity with userId ${userId.value} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new JobUserProfileNotFoundError(message, options);
  }
}
