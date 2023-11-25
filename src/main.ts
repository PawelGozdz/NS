const dotenv = require('dotenv');
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { EnvService } from './core/modules/environment/environment.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(app.get(Logger));
	app.flushLogs();

	const configService = app.get(EnvService);
	await app.listen(configService.get('PORT'));
}
bootstrap();
