import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class LanguageError extends DomainError {
  static withMessage(message: string, data?: DomainErrorOptions): LanguageError {
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new LanguageError(message, options);
  }
}
