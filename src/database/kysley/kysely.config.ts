import config from '@config/database';
import { ConfigurableModuleBuilder } from '@nestjs/common';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { IDatabaseDaos } from './daos';

export const { ConfigurableModuleClass: ConfigurableDatabaseModule } = new ConfigurableModuleBuilder().setClassMethodName('forRoot').build();

export class Database extends Kysely<IDatabaseDaos> {}

export const dialect = new PostgresDialect({
	pool: new Pool({
		host: config.connection.host,
		port: config.connection.port,
		user: config.connection.user,
		password: config.connection.password,
		database: config.connection.database,
	}),
});

export const kyselyPlugins = [
	new CamelCasePlugin({
		underscoreBetweenUppercaseLetters: true,
	}),
];
