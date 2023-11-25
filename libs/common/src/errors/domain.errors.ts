import { BaseError, ErrorOptions } from './base.error';
import { DomainErrorCode } from './error.enum';

type DomainErrorOptions = ErrorOptions & {
	domain?: string;
	code?: DomainErrorCode;
	data?: any;
	message?: string;
	error?: Error;
};

export abstract class DomainError extends BaseError implements DomainErrorOptions {
	domain?: string;
	code: DomainErrorCode;
	data?: any;
	timestamp?: Date;
	error?: Error;

	constructor(message: string, options: DomainErrorOptions | Error = {}) {
		super(message);

		if (options instanceof Error) {
			this.error = options;
		} else if (options && 'code' in options) {
			this.domain = options?.domain || '';
			this.code = options?.code || DomainErrorCode.Default;
			this.data = options?.data || {};
			this.error = options?.error;
		}

		this.timestamp = DomainError.generateTimestamp();
	}

	private static generateTimestamp(): Date {
		return new Date();
	}
}

export class MissingValueError extends DomainError {
	static default = 'Missing value';

	constructor(value: string, domain?: string) {
		super(`Missing value: ${value}`, {
			code: DomainErrorCode.MissingValue,
			domain,
		});
	}
}

export class InvalidParameterError extends DomainError {
	static default = 'Invalid parameter';

	constructor(parameter: string, message?: string, domain?: string) {
		super(`${InvalidParameterError.default}: ${parameter}.${message ? ` ${message}.` : ''}`, {
			code: DomainErrorCode.InvalidParameter,
			domain,
		});
	}
}

export class ConflictError extends DomainError {
	static default = 'Invalid parameter';

	constructor(message?: string, domain?: string) {
		super(message || ConflictError.default, {
			domain,
			code: DomainErrorCode.DuplicateEntry,
		});
	}
}
