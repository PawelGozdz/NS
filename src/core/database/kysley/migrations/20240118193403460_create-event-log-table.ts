// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { TableNames } from '../../table-names';

const tableName = TableNames.EVENT_LOG;

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'bigint', (col) => col.primaryKey().generatedAlwaysAsIdentity())
		.addColumn('data', 'jsonb', (col) => col.notNull())
		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('eventName', 'text', (col) => col.notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
