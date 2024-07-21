import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class IncorrectSalaryError extends DomainError {
  static withValue(min: number, max: number | null, data?: DomainErrorOptions): IncorrectSalaryError {
    const message = `Provided salary range is incorrect. Min: ${min}, Max: ${max}`;
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new IncorrectSalaryError(message, options);
  }
}
