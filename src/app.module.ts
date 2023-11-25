import { Module } from '@nestjs/common';

import config from '@config/app';
import loggerOptions from '@config/pino-logger';
import { LoggingInterceptor } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR, DiscoveryModule } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { EnvModule } from './core/modules/environment/environmental.module';

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: LoggingInterceptor,
	},
];

@Module({
	imports: [
		DiscoveryModule,
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => config,
		}),
		EnvModule,
		CqrsModule,
		LoggerModule.forRoot(loggerOptions),
	],
	controllers: [],
	providers: [...interceptors],
})
export class AppModule {}
