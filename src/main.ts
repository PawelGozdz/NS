import { INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { Logger } from 'nestjs-pino';

import config from '@app/config';

import { ApiGatewayModule } from './api-gateway';
import { AppModule } from './app.module';
import { otelSDK } from './core';
import { GracefulShutdownService } from './core/graceful-shutdown.service';
import { nestApplicationOptions } from './nest-app-configuration';
import { nestApplicationSecirityConfiguration } from './security-configuration';
import { SwaggerBuilder } from './swagger-setup';

async function buildSwaggers(app: INestApplication) {
  await SwaggerBuilder.build(app, ApiGatewayModule, '/api-docs', config.appConfig.APP_NAME, 'Rest API documentation', true);
}

async function bootstrap() {
  await otelSDK.start();

  const app = await NestFactory.create(AppModule, {
    ...nestApplicationOptions,
  });

  await buildSwaggers(app);

  app.use(cookieParser());

  const logger = app.get(Logger);
  app.useLogger(logger);
  app.flushLogs();

  // API VERSION
  app.setGlobalPrefix(config.globalPrefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: config.globalVersioning,
  });

  nestApplicationSecirityConfiguration(app);

  const gracefulShutdownServie = app.get(GracefulShutdownService);
  gracefulShutdownServie.setConfig({
    app,
    applicationName: config.appConfig.APP_NAME,
  });

  app.enableShutdownHooks();

  await app.listen(config.appConfig.PORT);

  process.on('unhandledRejection', (reason, _promise) => {
    logger.fatal('Unhandled Promise rejection:', reason);
    process.exit(1);
    // Handle the unhandled promise rejection here
  });

  process.on('uncaughtException', (error) => {
    logger.fatal('Uncaught Exception:', error);
    process.exit(1);
    // Handle the uncaught exception here
  });
}
bootstrap();
