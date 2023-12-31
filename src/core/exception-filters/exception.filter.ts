import {
	ApplicationError,
	ApplicationErrorCode,
	BaseError,
	DomainError,
	DomainErrorCode,
	FrameworkError,
	FrameworkErrorCode,
	UserErrorCode,
} from '@libs/common';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PinoLogger } from 'nestjs-pino';

interface ICoreMessages {
	messages: string[];
}

interface ICoreParams {
	path: string;
	statusCode: number;
	timestamp: string;
	messages: ICoreMessages['messages'];
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	defaultStatusCode = 500;

	constructor(private readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const timestamp = new Date().toISOString();
		const path = request.url;

		const coreParams: ICoreParams = {
			path,
			statusCode: this.defaultStatusCode,
			timestamp,
			messages: [],
		};

		const responseObj = this.mapResponse(exception, coreParams);

		return response.status(responseObj.statusCode).json(responseObj);
	}

	private baseErrors(exception: BaseError): ICoreMessages {
		return {
			messages: Array.isArray(exception.message) ? exception.message : [exception.message],
		};
	}
	private httpErrors(exception: HttpException): ICoreMessages {
		return {
			messages: Array.isArray(exception.message) ? exception.message : [exception.message],
		};
	}
	private otherErrors(exception: unknown): ICoreMessages {
		const message = (exception as Error).message;
		return {
			messages: [message],
		};
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

	private mapHttpCodeToHttpStatusCode(code?: number) {
		return code || this.defaultStatusCode;
	}

	private mapMessageToResponse(exception: BaseError | HttpException | unknown): ICoreMessages {
		if (exception instanceof HttpException) {
			return this.httpErrors(exception);
		}

		if (exception instanceof DomainError) {
			return this.baseErrors(exception);
		}

		return this.otherErrors(exception);
	}

	private mapResponse(exception: BaseError | HttpException, coreParams: ICoreParams) {
		const responseObj = { ...coreParams };

		responseObj.statusCode = this.mapCustomErrorToHttpStatusCode(exception) || this.defaultStatusCode;

		responseObj.messages = this.mapMessageToResponse(exception).messages;

		return responseObj;
	}
}
