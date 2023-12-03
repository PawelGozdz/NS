import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> | any {
		if (context.getType() === 'http') {
			return this.logHttpCall(context, next);
		}
	}

	private logHttpCall(context: ExecutionContext, next: CallHandler) {
		const request = context.switchToHttp().getRequest();
		const userAgent = request.get('user-agent') || '';
		const { ip, method, path: url }: Request = request;
		const correlationKey = uuidv4();
		const userId = request.user?.userId;

		this.logger.info(`[${context.getClass().name}->${context.getHandler().name}] ${method} ${url} ${userId ? userId : ''} ${userAgent} ${ip}`);

		const now = Date.now();
		return next.handle().pipe(
			tap(() => {
				const response = context.switchToHttp().getResponse();

				const { statusCode } = response;
				const contentLength = response.get('content-length');

				this.logger.info(`[${correlationKey}] ${method} ${url} ${statusCode} ${contentLength ? contentLength : ''}: ${Date.now() - now}ms`);
			}),
		);
	}
}
