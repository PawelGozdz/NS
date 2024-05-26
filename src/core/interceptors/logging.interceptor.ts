/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { ClsService } from 'nestjs-cls';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly ctx: ClsService,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | any {
    if (context.getType() === 'http') {
      return this.logHttpCall(context, next);
    }
  }

  private logHttpCall(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const userAgent: string = request.get('user-agent') ?? '';
    const { ip, method, path: url }: Request = request;
    const correlationKey = this.ctx.getId();
    const userId: string = request.user?.userId;
    const reqTime = Date.now();

    this.logger.info(
      `REQUEST [${correlationKey}] [${context.getClass().name} --> ${context.getHandler().name}] ${method} ${url} ${
        userId ? `[USER: ${userId}]` : ''
      } ${userAgent} ${ip}`,
    );

    return next.handle().pipe(
      tap(() => {
        const resTime = Date.now();
        const response: Response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        const responseText = `RESPONSE [${correlationKey}] ${method} ${url} ${statusCode} ${contentLength ?? ''}: ${Date.now() - reqTime}ms`;

        this.logger.info(
          {
            statusMessage: response.statusMessage,
            ip,
            method,
            url,
            userId,
            correlationId: correlationKey,
            statusCode,
            contentLength,
            reqTime,
            resTime,
          },
          responseText,
        );
      }),
    );
  }
}
