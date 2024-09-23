import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import config from '@app/config';
import { ContextModule } from '@app/contexts';
import { AccessTokenGuard, GlobalExceptionFilter, JsendTransformSuccessInterceptor, LoggingInterceptor } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

import { CategoriesControllerV1 } from './features';
import { JobPositionsControllerV1, JobUserProfilesControllerV1, SkillsControllerV1 } from './jobs';
import { AuthJwtControllerV1, UsersControllerV1 } from './user-management';

const interceptors = [
  {
    provide: APP_INTERCEPTOR,
    useClass: LoggingInterceptor,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: JsendTransformSuccessInterceptor,
  },
];

const exceptionFilters = [
  {
    provide: APP_FILTER,
    useClass: GlobalExceptionFilter,
  },
];

const guards = [
  { provide: APP_GUARD, useClass: AccessTokenGuard },
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
];

const pipes = [
  {
    provide: 'APP_PIPE',
    useFactory: () =>
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
  },
];

const controllersV1 = [
  AuthJwtControllerV1,
  UsersControllerV1,
  CategoriesControllerV1,
  JobUserProfilesControllerV1,
  SkillsControllerV1,
  JobPositionsControllerV1,
];

@Module({
  imports: [
    CqrsModule,
    ContextModule,
    ThrottlerModule.forRoot([
      {
        ttl: config.appConfig.THROTTLER_TTL,
        limit: config.appConfig.THROTTLER_LIMIT,
      },
    ]),
  ],
  controllers: [...controllersV1],
  providers: [...exceptionFilters, ...interceptors, ...guards, ...pipes],
})
export class ApiGatewayModule {}
