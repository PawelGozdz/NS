import { Kysely, Transaction, sql } from 'kysely';
import { TableNames } from '../table-names';

export class TestingE2EFunctions {
	constructor(private readonly connection: Kysely<any>) {}

	async truncateTables(givenTables?: string[], trx?: Transaction<any>) {
		const tables = !givenTables?.length ? Object.values(TableNames) : givenTables;

		for await (const tableName of tables) {
			await sql.raw(`TRUNCATE TABLE ${this.convertCamelToSnakeCase(tableName)} CASCADE`).execute(trx ?? this.connection);
		}
	}

	convertCamelToSnakeCase(str: string) {
		return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
	}
}
