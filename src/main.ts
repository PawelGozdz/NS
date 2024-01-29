import '@config/app';

import config, { globalPrefix, globalVersioning } from '@config/app';
import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import { AppModule } from './app.module';
import { GracefulShutdownService } from './core/graceful-shutdown.service';
import { nestApplicationOptions } from './nest-app-configuration';
import { nestApplicationSecirityConfiguration } from './security-configuration';

async function bootstrap() {
	// await otelSDK.start();

	const app = await NestFactory.create(AppModule, {
		...nestApplicationOptions,
	});

	app.use(cookieParser());

	app.useLogger(app.get(Logger));
	app.flushLogs();

	// API VERSION
	app.setGlobalPrefix(globalPrefix);
	app.enableVersioning({
		type: VersioningType.URI,
		defaultVersion: globalVersioning,
	});

	nestApplicationSecirityConfiguration(app);

	const gracefulShutdownServie = app.get(GracefulShutdownService);
	gracefulShutdownServie.setConfig({
		app,
		applicationName: config.APP_NAME,
	});

	app.enableShutdownHooks();

	await app.listen(config.PORT);
}
bootstrap();

process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Promise rejection:', reason);
	process.exit(1);
	// Handle the unhandled promise rejection here
});

process.on('uncaughtException', (error) => {
	console.error('Uncaught Exception:', error);
	process.exit(1);
	// Handle the uncaught exception here
});
