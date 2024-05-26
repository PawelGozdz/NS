/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiResponseStatusJsendEnum, createJsendResponse } from '../api';

@Injectable()
export class JsendTransformSuccessInterceptor implements NestInterceptor {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(this.constructor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> | any {
    return next.handle().pipe(map((data) => this.mapSuccessResponse(data, context)));
  }

  private mapSuccessResponse(responseData: any, context: ExecutionContext) {
    const timestamp = new Date().toISOString();
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const { statusCode } = response;

    const jsend = createJsendResponse(ApiResponseStatusJsendEnum.SUCCESS, responseData);

    const res = {
      statusCode,
      timestamp,
      path: request.url,
      ...jsend,
    };

    return res;
  }
}
