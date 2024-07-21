import { DomainError, DomainErrorCode, DomainErrorOptions } from '@libs/common';

export class CertificationError extends DomainError {
  static withMessage(message: string, data?: DomainErrorOptions): CertificationError {
    const options = {
      code: DomainErrorCode.InvalidParameter,
      data,
    };
    return new CertificationError(message, options);
  }
}
