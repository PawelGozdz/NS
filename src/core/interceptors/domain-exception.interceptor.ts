import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DomainErrorInterceptor implements NestInterceptor {
	constructor(private readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> | any {
		if (context.getType() === 'http') {
			return this.logHttpCall(context, next);
		}
		return next.handle();
	}

	private logHttpCall(context: ExecutionContext, next: CallHandler) {
		const now = Date.now();
		return next.handle().pipe(
			catchError((error) => {
				this.logger.debug(`Intercepting -- [${context.getClass().name} --> ${context.getHandler().name}]`);
				return throwError(error);
			}),
		);
	}
}
