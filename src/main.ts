import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { EnvService } from './core/modules/environment/domain/env.service';

async function bootstrap() {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });
	app.useLogger(app.get(Logger));
	app.flushLogs();

	const configService = app.get(EnvService);
	await app.listen(configService.get('PORT'));
}
bootstrap();
