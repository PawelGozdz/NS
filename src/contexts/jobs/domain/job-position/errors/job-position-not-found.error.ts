import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class JobPositionNotFoundError extends DomainError {
  static withId(id: number, data?: DomainErrorOptions): JobPositionNotFoundError {
    const message = `Entity with id ${id} doesn't exists`;
    const options = {
      code: DomainErrorCode.NotFound,
      data,
    };
    return new JobPositionNotFoundError(message, options);
  }
}
