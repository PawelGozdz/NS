import { AppUtils, ApplicationErrorCode, ErrorOptions } from '@libs/common';

import { BaseError } from './base.error';

export class ApplicationError extends BaseError implements ApplicationErrorOptions {
  module?: string;

  code?: ApplicationErrorCode;

  data?: unknown;

  timestamp?: Date;

  error?: Error;

  constructor(message: string, options: ApplicationErrorOptions | Error = {}) {
    super(message);

    if (options instanceof Error) {
      this.error = options;
    } else if (AppUtils.isNotEmpty(options) && 'code' in options) {
      const { module = '', code, data = {}, error } = options;
      this.module = module;
      this.code = code;
      this.data = data;
      this.error = error;
    }

    this.timestamp = new Date();
  }
}

export type ApplicationErrorOptions = ErrorOptions & {
  module?: string;
  data?: unknown;
  error?: Error;
};

export class ValidationApplicationError extends ApplicationError {
  static createValidationFailedError(data?: ApplicationErrorOptions): ValidationApplicationError {
    const message = (data?.message as string) || 'Validation Error';
    const options = {
      code: ApplicationErrorCode.ValidationFailed,
      data,
    };
    return new ValidationApplicationError(message, options);
  }
}
