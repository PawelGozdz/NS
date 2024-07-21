import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class ExperienceError extends DomainError {
  static withValue(startDate: Date, endDate: Date | null, data?: DomainErrorOptions): ExperienceError {
    const message = `Invalid experience details. Start date: ${startDate}, End date: ${endDate}`;
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new ExperienceError(message, options);
  }

  static withMessage(message: string, data?: DomainErrorOptions): ExperienceError {
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new ExperienceError(message, options);
  }
}
