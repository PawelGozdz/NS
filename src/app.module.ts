import { Module } from '@nestjs/common';

import config from '@config/app';
import loggerOptions from '@config/pino-logger';
import { CqrsModule } from '@libs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ApiGatewayModule } from './api-gateway';

import { EnvModule } from './core/modules/environment/environmental.module';
import { DatabaseModule } from './database/database.module';
import { ServicesModule } from './services';

const providers = [];

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => config,
		}),
		DatabaseModule,
		ApiGatewayModule,
		EnvModule,
		CqrsModule,
		LoggerModule.forRoot(loggerOptions),
		ServicesModule,
	],
	providers: [...providers],
})
export class AppModule {}
