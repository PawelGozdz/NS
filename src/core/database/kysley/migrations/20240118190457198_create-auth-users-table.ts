// eslint-disable @typescript-eslint/no-explicit-any

import { TableNames } from '@app/core';
import { Kysely, sql } from 'kysely';

const tableName = TableNames.AUTH_USERS;

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('email', 'varchar', (col) => col.notNull().unique())
		.addColumn('userId', 'uuid', (col) => col.notNull().unique())
		.addColumn('hash', 'varchar', (col) => col.notNull())
		.addColumn('hashedRt', 'varchar')
		.addColumn('lastLogin', 'varchar')
		.addColumn('tokenRefreshedAt', 'varchar')

		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
