import { TableNames } from '@app/database/table-names';
import { Kysely, sql } from 'kysely';

const tableName = TableNames.CATEGORIES;

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'serial', (col) => col.primaryKey())
		.addColumn('name', 'varchar(60)', (col) => col.notNull())
		.addColumn('description', 'text')
		.addColumn('parentId', 'integer', (col) => col.references(`${TableNames.CATEGORIES}.id`).onDelete('cascade'))
		.addColumn('ctx', 'varchar(15)', (col) => col.notNull())
		.addColumn('version', 'integer', (col) => col.notNull().defaultTo(0))

		.addCheckConstraint('check_parent', sql`id <> parent_id`)
		.addUniqueConstraint('categories_name_context_uq', ['name', 'ctx'])
		.addColumn('createdAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updatedAt', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
