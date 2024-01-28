import { Kysely, sql } from 'kysely';
import { TableNames } from '../table-names';
import { IDatabaseDaos } from './daos';

export class TestingE2EFunctions {
	constructor(private readonly connection: Kysely<IDatabaseDaos>) {}

	async truncateTables(givenTables?: string[]) {
		const tables = !givenTables?.length ? Object.values(TableNames) : givenTables;

		for await (const tableName of tables) {
			sql.raw(`TRUNCATE TABLE ${this.convertCamelToSnakeCase(tableName)} CASCADE`).execute(this.connection);
		}
	}

	convertCamelToSnakeCase(str: string) {
		return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
	}
}
