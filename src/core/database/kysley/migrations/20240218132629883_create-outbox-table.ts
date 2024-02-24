// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { TableNames } from '../../table-names';

const tableName = TableNames.OUTBOX;

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('eventName', 'text', (col) => col.notNull())
		.addColumn('ctx', 'varchar(15)', (col) => col.notNull())
		.addColumn('data', 'jsonb', (col) => col.notNull())
		.addColumn('publishedOn', 'date')

		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
