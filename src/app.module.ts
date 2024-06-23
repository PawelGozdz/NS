import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ClsModule } from 'nestjs-cls';
import { LoggerModule } from 'nestjs-pino';

import { ApiGatewayModule } from '@app/api-gateway';
import config from '@app/config';
import { Database, DatabaseModule, GracefulShutdownService, JobModule, OpenTelemetryModuleModule } from '@app/core';
import { AppUtils } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';

const providers = [GracefulShutdownService];

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
    }),
    DatabaseModule,
    ClsModule.forRootAsync({
      global: true,
      useFactory: () => ({
        middleware: {
          mount: true,
          generateId: true,
          idGenerator: (req: Request) => (req.headers['X-Request-Id'] as string | undefined) ?? AppUtils.getUUID(),
        },
      }),
      plugins: [
        new ClsPluginTransactional({ imports: [DatabaseModule], adapter: new TransactionalAdapterKysely({ kyselyInstanceToken: Database }) }),
      ],
    }),
    ApiGatewayModule,
    CqrsModule,
    LoggerModule.forRoot(config.pinoLogger),
    OpenTelemetryModuleModule,
    JobModule,
  ],
  providers: [...providers],
})
export class AppModule {}
