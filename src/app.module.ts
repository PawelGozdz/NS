import { Module } from '@nestjs/common';

import config from '@config/app';
import loggerOptions from '@config/pino-logger';
import { CqrsModule } from '@libs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LoggerModule } from 'nestjs-pino';
import { ApiGatewayModule } from './api-gateway';

import { ContextModule } from './contexts';
import { EnvModule } from './core/modules/environment/environmental.module';
import { DatabaseModule } from './database/kysley';

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
	],
})
export class AppModule {}
