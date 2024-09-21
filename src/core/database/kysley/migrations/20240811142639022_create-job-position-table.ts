import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.JOB_POSITIONS;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('title', 'varchar(60)', (col) => col.notNull())
    .addColumn('slug', 'varchar(60)', (col) => col.notNull())
    .addColumn('categoryId', 'integer', (col) => col.references(`${TableNames.CATEGORIES}.id`).onDelete('set null'))
    .addColumn('skillIds', sql`integer[]`, (col) => col.defaultTo('{}'))

    .addUniqueConstraint('job_position_slug_category_id_uq', ['slug', 'categoryId'])
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
