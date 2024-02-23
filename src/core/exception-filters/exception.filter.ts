import {
	ApplicationError,
	ApplicationErrorCode,
	BaseError,
	DomainError,
	DomainErrorCode,
	FrameworkError,
	FrameworkErrorCode,
	PostgresErrorCode,
	UserErrorCode,
} from '@libs/common';
import { ApiResponseBase, ApiResponseStatusJsendEnum, createJsendResponse } from '@libs/common/api';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { isNumberString } from 'class-validator';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	defaultStatusCode = 500;

	constructor(
		private readonly logger: PinoLogger,
		private readonly httpAdapterHost: HttpAdapterHost,
	) {
		this.logger.setContext(this.constructor.name);
	}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();
		const { httpAdapter } = this.httpAdapterHost;
		const timestamp = new Date().toISOString();
		const path = request.url;

		const coreParams = new ApiResponseBase(this.defaultStatusCode, timestamp, path);

		const responseObj = this.mapResponse(exception, coreParams);

		return httpAdapter.reply(response, responseObj, responseObj.statusCode);
	}

	private baseErrors(exception: BaseError) {
		return exception.message;
	}
	private httpErrors(exception: HttpException) {
		return exception.message;
	}
	private otherErrors(exception: unknown) {
		const message = (exception as Error).message;
		return message || FrameworkErrorCode.UnknownError;
	}

	private mapCustomErrorToHttpStatusCode(error: BaseError | HttpException | unknown) {
		if (error instanceof HttpException) {
			return this.mapHttpCodeToHttpStatusCode(error.getStatus());
		}

		if (error instanceof DomainError) {
			return this.mapDomainCodeToHttpStatusCode(error.code);
		}

		if (error instanceof ApplicationError) {
			return this.mapApplicationCodeToHttpStatusCode(error.code);
		}

		if (error instanceof FrameworkError && isNumberString(error.code)) {
			return this.mapPostgreskCodeToHttpStatusCode(error.code!);
		}

		if (error instanceof FrameworkError) {
			return this.mapFrameworkCodeToHttpStatusCode(error.code);
		}

		return this.defaultStatusCode;
	}

	private mapDomainCodeToHttpStatusCode(code?: DomainErrorCode) {
		switch (code) {
			case DomainErrorCode.MissingValue:
				return 400;
			case DomainErrorCode.InvalidParameter:
				return 400;
			case DomainErrorCode.UnknownError:
				return 400;
			case DomainErrorCode.InvalidCredentials:
				return 401;
			case DomainErrorCode.Unauthorized:
				return 401;
			case DomainErrorCode.Forbidden:
				return 403;
			case DomainErrorCode.NotFound:
				return 404;
			case DomainErrorCode.DuplicateEntry:
				return 409;
			case DomainErrorCode.ValidationFailed:
				return 422;
			default:
				return 500;
		}
	}

	private mapApplicationCodeToHttpStatusCode(code?: ApplicationErrorCode | UserErrorCode) {
		switch (code) {
			case ApplicationErrorCode.DuplicateEntry:
				return 409;
			case ApplicationErrorCode.ValidationFailed:
				return 422;
			case ApplicationErrorCode.Unavailable:
				return 503;
			case ApplicationErrorCode.Unauthorized:
				return 401;
			case ApplicationErrorCode.Forbidden:
				return 403;
			case ApplicationErrorCode.NotFound:
				return 404;
			case ApplicationErrorCode.InvalidParameter:
				return 400;
			case ApplicationErrorCode.InvalidCredentials:
				return 401;
			case ApplicationErrorCode.LimitExceeded:
				return 429;
			case ApplicationErrorCode.TimeoutError:
				return 504;
			case UserErrorCode.CannotCreate:
				return 400;
			default:
				return 500;
		}
	}

	private mapFrameworkCodeToHttpStatusCode(code?: FrameworkErrorCode) {
		switch (code) {
			case FrameworkErrorCode.DuplicateEntry:
				return 409;
			case FrameworkErrorCode.ValidationFailed:
				return 422;
			case FrameworkErrorCode.Unavailable:
				return 503;
			case FrameworkErrorCode.Unauthorized:
				return 401;
			case FrameworkErrorCode.Forbidden:
				return 403;
			case FrameworkErrorCode.NotFound:
				return 404;
			case FrameworkErrorCode.InvalidParameter:
				return 400;
			case FrameworkErrorCode.InvalidCredentials:
				return 401;
			case FrameworkErrorCode.LimitExceeded:
				return 429;
			case FrameworkErrorCode.TimeoutError:
				return 504;
			case FrameworkErrorCode.ExternalServiceError:
				return 503;
			case FrameworkErrorCode.RateLimitExceeded:
				return 429;
			case FrameworkErrorCode.SecurityError:
				return 403;
			default:
				return 500;
		}
	}

	private mapPostgreskCodeToHttpStatusCode(code: string) {
		switch (code) {
			case PostgresErrorCode.UniqueViolation:
			case PostgresErrorCode.ForeignKeyViolation:
				return 409; // Conflict
			case PostgresErrorCode.NotNullViolation:
			case PostgresErrorCode.CheckViolation:
			case PostgresErrorCode.InvalidTextRepresentation:
			case PostgresErrorCode.NumericValueOutOfRange:
			case PostgresErrorCode.DivisionByZero:
			case PostgresErrorCode.DataException:
			case PostgresErrorCode.IntegrityConstraintViolation:
			case PostgresErrorCode.SyntaxErrorOrAccessRuleViolation:
			case PostgresErrorCode.UndefinedTable:
			case PostgresErrorCode.UndefinedColumn:
				return 400; // Bad Request
			case PostgresErrorCode.InsufficientResources:
			case PostgresErrorCode.DiskFull:
			case PostgresErrorCode.OutOfMemory:
			case PostgresErrorCode.TooManyConnections:
			case PostgresErrorCode.ConfigurationLimitExceeded:
			case PostgresErrorCode.OperatorIntervention:
			case PostgresErrorCode.SystemError:
			case PostgresErrorCode.IoError:
				return 500; // Internal Server Error
			default:
				return 500; // Internal Server Error
		}
	}

	private mapHttpCodeToHttpStatusCode(code?: number) {
		return code || this.defaultStatusCode;
	}

	private mapMessageToResponse(exception: BaseError | HttpException | unknown) {
		if (exception instanceof HttpException) {
			return this.httpErrors(exception);
		}

		if (exception instanceof DomainError) {
			return this.baseErrors(exception);
		}

		return this.otherErrors(exception);
	}

	private mapJsendProperties(exception: BaseError | HttpException | Error, statusCode: number) {
		const message = this.mapMessageToResponse(exception);
		const status = this.getStatus(statusCode);
		let data: any = null;
		const isFail = this.isFail(statusCode);

		if (exception instanceof HttpException) {
			const subErrors = Array.isArray(exception?.['response']?.message) ? exception['response'].message : undefined;
			data = isFail ? { subErrors, error: message } : null;
		} else if (exception instanceof BaseError) {
			data = isFail ? { error: message } : null;
		} else {
			data = isFail ? { error: message } : null;
		}

		return isFail ? createJsendResponse(status, { ...data }) : createJsendResponse(status, message);
	}

	isFail(statusCode: number) {
		return statusCode >= 400 && statusCode < 500;
	}

	getStatus(statusCode: number) {
		return this.isFail(statusCode) ? ApiResponseStatusJsendEnum.FAIL : ApiResponseStatusJsendEnum.ERROR;
	}

	private mapResponse(exception: BaseError | HttpException, coreParams: ApiResponseBase) {
		const responseObj = { ...coreParams };

		responseObj.statusCode = this.mapCustomErrorToHttpStatusCode(exception) || this.defaultStatusCode;
		const jsonResponsetype = this.mapJsendProperties(exception, responseObj.statusCode);

		return { ...responseObj, ...jsonResponsetype };
	}
}
