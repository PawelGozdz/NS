import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { Request } from 'express';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';

import { ApiGatewayModule } from '@app/api-gateway';
import config from '@app/config';
import { DatabaseModule, GracefulShutdownService, OpenTelemetryModuleModule, OutboxModule } from '@app/core';
import { AppUtils } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';

const providers = [GracefulShutdownService];

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
    }),
    ClsModule.forRootAsync({
      global: true,
      useFactory: () => ({
        middleware: {
          mount: true,
          generateId: true,
          idGenerator: (req: Request) => (req.headers['X-Request-Id'] as string | undefined) ?? AppUtils.getUUID(),
        },
      }),
    }),
    DatabaseModule,
    ApiGatewayModule,
    CqrsModule,
    LoggerModule.forRoot(config.pinoLogger),
    OpenTelemetryModuleModule,
    OutboxModule,
  ],
  providers: [...providers],
})
export class AppModule {}
