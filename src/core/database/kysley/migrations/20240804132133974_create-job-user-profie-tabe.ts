import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.JOB_USER_PROFILES;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('bio', 'varchar')
    .addColumn('userId', 'uuid', (col) => col.notNull().unique().references(`${TableNames.USERS}.id`).onDelete('cascade'))
    .addColumn('salaryRange', 'jsonb', (col) => col.notNull())
    .addColumn('jobIds', sql`uuid[]`)
    .addColumn('jobPositionIds', sql`uuid[]`)
    .addColumn('experience', 'jsonb')
    .addColumn('education', 'jsonb')
    .addColumn('certificates', 'jsonb')
    .addColumn('version', 'integer', (col) => col.notNull().defaultTo(0))

    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
