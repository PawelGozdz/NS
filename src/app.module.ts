import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';

import { ApiGatewayModule } from '@app/api-gateway';
import config from '@app/config';
import { DatabaseModule, GracefulShutdownService, OpenTelemetryModuleModule, OutboxModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';

const providers = [GracefulShutdownService];

@Module({
  imports: [
    EventEmitterModule.forRoot({
      global: true,
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
