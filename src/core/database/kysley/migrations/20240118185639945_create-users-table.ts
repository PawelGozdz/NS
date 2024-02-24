// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { TableNames } from '../../table-names';
import { onUpdateTrigger } from '../helpers';

const tableName = TableNames.USERS;
const onUpdateTriggerQuery = onUpdateTrigger(tableName);

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('email', 'varchar', (col) => col.notNull().unique())
		.addColumn('version', 'integer', (col) => col.notNull().defaultTo(0))

		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute()
		.then(() => sql.raw(`${onUpdateTriggerQuery}`).execute(db));
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
