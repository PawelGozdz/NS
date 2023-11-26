import config from '@config/database';
import { Knex } from 'knex';
import { knexSnakeCaseMappers } from 'objection';

import * as migrations from './migrations';

type KnexConfiguration = Knex.Config | { [environment: string]: Knex.Config };
type MigrationName = keyof typeof migrations;

export class DatabaseMigrationSource implements Knex.MigrationSource<string> {
	getMigrations(): Promise<string[]> {
		return Promise.resolve(Object.keys(migrations));
	}

	getMigration(migration: MigrationName): Promise<Knex.Migration> {
		const migrationFunction = migrations[migration];
		return Promise.resolve(migrationFunction as unknown as Knex.Migration);
	}

	getMigrationName(migration: string) {
		return migration;
	}
}

const databaseConfig: KnexConfiguration = {
	...config,
	client: 'pg',
	pool: {
		min: 2,
		max: 10,
	},
	migrations: {
		stub: 'migration.stub',
		migrationSource: new DatabaseMigrationSource(),
	},
	seeds: {
		directory: 'seeds',
		stub: 'seed.stub',
	},
	...knexSnakeCaseMappers(),
};

export default databaseConfig;
