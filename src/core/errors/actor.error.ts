import { ActorType, DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class ActorError extends DomainError {
  static withType(type: ActorType, data?: DomainErrorOptions): ActorError {
    const message = `Invalid actor type: ${type}`;
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new ActorError(message, options);
  }

  static withMessage(message: string, data?: DomainErrorOptions): ActorError {
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new ActorError(message, options);
  }
}
