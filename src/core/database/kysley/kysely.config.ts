import config from '@app/config';
import { IDatabaseModels } from '@libs/common';
import { ConfigurableModuleBuilder, Injectable } from '@nestjs/common';
import { CamelCasePlugin, Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

export const { ConfigurableModuleClass: ConfigurableDatabaseModule } = new ConfigurableModuleBuilder().setClassMethodName('forRoot').build();

@Injectable()
export class Database extends Kysely<IDatabaseModels> {}

export const dialect = new PostgresDialect({
	pool: new Pool({
		host: config.dbConfig.connection.host,
		port: config.dbConfig.connection.port,
		user: config.dbConfig.connection.user,
		password: config.dbConfig.connection.password,
		database: config.dbConfig.connection.database,
	}),
});

export const kyselyPlugins = [
	new CamelCasePlugin({
		underscoreBetweenUppercaseLetters: true,
	}),
];
