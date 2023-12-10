import { ApplicationErrorCode, ErrorOptions } from '@libs/common';
import { BaseError } from './base.error';

export type ApplicationErrorOptions = ErrorOptions & {
	module?: string;
	data?: any;
	error?: Error;
};

export class ApplicationError extends BaseError implements ApplicationErrorOptions {
	module?: string;
	code?: ApplicationErrorCode;
	data?: any;
	timestamp?: Date;
	error?: Error;

	constructor(message: string, options: ApplicationErrorOptions | Error = {}) {
		super(message);

		if (options instanceof Error) {
			this.error = options;
		} else if (options && 'code' in options) {
			this.module = options?.module || '';
			this.code = options.code;
			this.data = options?.data || {};
			this.error = options?.error;
		}

		this.timestamp = ApplicationError.generateTimestamp();
	}

	private static generateTimestamp(): Date {
		return new Date();
	}
}

export class ValidationApplicationError extends ApplicationError {
	static createValidationFailedError(data?: ApplicationErrorOptions): ValidationApplicationError {
		const message = data?.message || 'Validation Error';
		const options = {
			code: ApplicationErrorCode.ValidationFailed,
			data,
		};
		return new ValidationApplicationError(message, options);
	}
}
