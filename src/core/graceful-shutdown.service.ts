import { INestApplication, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { sql } from 'kysely';
import { PinoLogger } from 'nestjs-pino';

import { Database } from '@app/core';
import { AppUtils } from '@libs/common';

import { JobManagerService, otelSDK } from './modules';

export interface GracefulShutDownConfig {
  app: INestApplication;
  applicationName: string;
}

@Injectable()
export class GracefulShutdownService implements OnApplicationShutdown {
  app: INestApplication;

  config: GracefulShutDownConfig;

  constructor(
    private readonly logger: PinoLogger,
    private readonly db: Database,
    private readonly jobManagerService: JobManagerService,
  ) {}

  async onApplicationShutdown(signal?: string) {
    if (AppUtils.isEmpty(this.config)) return;

    this.logger.info(`****** Shutting down application ${this.config.applicationName.toLocaleUpperCase()} with signal ${signal} ******`);

    await this.shutdownDatabase();

    await this.shutdownOT();

    await this.shutdownJobs();

    this.logger.info('****** All processes successfuly shut down ******');
  }

  setConfig(config: GracefulShutDownConfig) {
    if (AppUtils.isEmpty(config.app) || AppUtils.isEmpty(config.applicationName)) {
      this.logger.error('Invalid GracefulShutDown configuration');
      throw new Error('Invalid GracefulShutDown configuration');
    }
    this.config = config;
  }

  async shutdownJobs() {
    try {
      this.logger.info('Shutting down jobs connection');
      await this.jobManagerService.stopJobs();
      this.logger.info('Jobs connection closed');
    } catch (error) {
      this.logger.info(error, 'Jobs connection is already closed');
    }
  }

  async shutdownDatabase() {
    if (AppUtils.isEmpty(this.db)) return;

    try {
      await sql`SELECT 1`.execute(this.db);
      this.logger.info('Shutting down database connection');
      await this.db.destroy();
      this.logger.info('Database connection closed');
    } catch (error) {
      this.logger.info('Database connection is already closed');
    }
  }

  async shutdownOT() {
    try {
      this.logger.info('Shutting down OT SDK...');
      await otelSDK.shutdown();
      this.logger.info('OT SDK shut down successfully');
    } catch (error) {
      this.logger.info('OT SDK shut down unsuccessfully!');
    }
  }
}
