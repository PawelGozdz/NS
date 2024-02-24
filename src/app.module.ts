import config from '@config/app';
import loggerOptions from '@config/pino-logger';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';

import { ApiGatewayModule } from './api-gateway';
import { ContextModule } from './contexts';
import { DatabaseModule, EnvModule, GracefulShutdownService, OpenTelemetryModuleModule, OutboxModule } from './core';

const providers = [GracefulShutdownService];

@Module({
	imports: [
		EventEmitterModule.forRoot({
			global: true,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			validate: () => config,
		}),
		DatabaseModule,
		ApiGatewayModule,
		EnvModule,
		CqrsModule,
		LoggerModule.forRoot(loggerOptions),
		ContextModule,
		OpenTelemetryModuleModule,
		OutboxModule,
	],
	providers: [...providers],
})
export class AppModule {}
