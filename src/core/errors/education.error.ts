import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class EducationError extends DomainError {
  static withMessage(message: string, data?: DomainErrorOptions): EducationError {
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new EducationError(message, options);
  }
}
