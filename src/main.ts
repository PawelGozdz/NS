const dotenv = require('dotenv');
dotenv.config();

import { globalPrefix, globalVersioning } from '@config/app';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { EnvService } from './core/modules/environment/environment.service';
import { nestApplicationOptions } from './nest-app-configuration';
import { nestApplicationSecirityConfiguration } from './security-configuration';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		...nestApplicationOptions,
	});
	app.useLogger(app.get(Logger));
	app.flushLogs();

	// API VERSION
	app.setGlobalPrefix(globalPrefix);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: globalVersioning,
	});

	nestApplicationSecirityConfiguration(app);

	const configService = app.get(EnvService);
	await app.listen(configService.get('PORT'));
}
bootstrap();
