import loggerOptions from '@app/config/pino-logger';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';

import { ApiGatewayModule } from './api-gateway';
import { DatabaseModule, GracefulShutdownService, OpenTelemetryModuleModule, OutboxModule } from './core';

const providers = [GracefulShutdownService];

@Module({
	imports: [
		EventEmitterModule.forRoot({
			global: true,
		}),
		DatabaseModule,
		ApiGatewayModule,
		CqrsModule,
		LoggerModule.forRoot(loggerOptions),
		OpenTelemetryModuleModule,
		OutboxModule,
	],
	providers: [...providers],
})
export class AppModule {}
