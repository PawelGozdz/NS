// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.CATEGORIES;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(60)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('parentId', 'integer', (col) => col.references(`${tableName}.id`).onDelete('cascade'))
    .addColumn('context', 'varchar(15)', (col) => col.notNull())

    .addCheckConstraint('check_parent', sql`id <> parent_id`)
    .addUniqueConstraint('categories_name_context_uq', ['name', 'context'])
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
