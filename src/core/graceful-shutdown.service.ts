import { Database } from '@app/database';
import { INestApplication, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { sql } from 'kysely';
import { PinoLogger } from 'nestjs-pino';
import { otelSDK } from './modules';

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
	) {
		this.logger.setContext(this.constructor.name);
	}

	async onApplicationShutdown(signal?: string) {
		this.logger.info(`****** Shutting down application ${this.config.applicationName.toLocaleUpperCase()} with signal ${signal} ******`);

		await this.shutdownDatabase();

		await this.shutdownOT();

		this.logger.info(`****** All processes successfuly shut down ******`);

		this.exitProcess();
	}

	setConfig(config: GracefulShutDownConfig) {
		if (!config.app || !config.applicationName) {
			this.logger.error(`Invalid GracefulShutDown configuration`);
			throw new Error(`Invalid GracefulShutDown configuration`);
		}
		this.config = config;
	}

	exitProcess() {
		process.exit(0);
	}

	async shutdownDatabase() {
		if (!this.db) return;

		try {
			await sql`SELECT 1`.execute(this.db);
			this.logger.info(`Shutting down database connection`);
			await this.db.destroy();
			this.logger.info(`Database connection closed`);
		} catch (error) {
			this.logger.info(`Database connection is already closed`);
			return;
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
