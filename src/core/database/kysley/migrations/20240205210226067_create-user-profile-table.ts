// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.USER_PROFILES;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('userId', 'uuid', (col) => col.notNull().unique().references(`${TableNames.USERS}.id`).onDelete('cascade'))
    .addColumn('firstName', 'varchar')
    .addColumn('lastName', 'varchar')
    .addColumn('dateOfBirth', 'date')
    .addColumn('username', 'varchar')
    .addColumn('phoneNumber', 'varchar')
    .addColumn('gender', 'varchar')
    .addColumn('bio', 'varchar')
    .addColumn('hobbies', sql`text[]`, (col) => col.defaultTo('{}'))
    .addColumn('languages', sql`text[]`, (col) => col.defaultTo('{}'))
    .addColumn('profilePicture', 'varchar')
    .addColumn('rodoAcceptanceDate', 'date')
    .addColumn('address', 'jsonb')

    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
