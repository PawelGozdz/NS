// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.EVENT_LOG;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'bigint', (col) => col.primaryKey().generatedAlwaysAsIdentity())
    .addColumn('data', 'jsonb', (col) => col.notNull())
    .addColumn('actor', 'jsonb', (col) => col.notNull())
    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('eventName', 'text', (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
