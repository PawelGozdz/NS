import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.JOBS;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .createTable(tableName)
    .addColumn('id', 'uuid', (col) => col.primaryKey())
    .addColumn('title', 'varchar(60)')
    .addColumn('isActive', 'boolean', (col) => col.defaultTo(false).notNull())
    .addColumn('description', 'text')
    .addColumn('organizationId', 'uuid') // optional for now
    .addColumn('jobPositionId', 'uuid', (col) => col.references(`${TableNames.JOB_POSITIONS}.id`).notNull())
    .addColumn('location', 'varchar(120)')
    .addColumn('categoryIds', sql`integer[]`, (col) => col.defaultTo('{}'))
    .addColumn('salaryRange', 'jsonb', (col) => col.defaultTo('{}'))
    .addColumn('requiredSkills', 'jsonb', (col) => col.defaultTo('{}'))
    .addColumn('niceToHaveSkills', 'jsonb', (col) => col.defaultTo('{}'))
    .addColumn('requirements', sql`text[]`, (col) => col.defaultTo('{}'))
    .addColumn('languages', sql`text[]`, (col) => col.defaultTo('{}'))
    .addColumn('benefits', sql`text[]`, (col) => col.defaultTo('{}'))
    .addColumn('startDate', 'timestamptz')
    .addColumn('endDate', 'timestamptz')
    .addColumn('publicationDate', 'timestamptz')
    .addColumn('expireDate', 'timestamptz')
    .addColumn('contact', 'varchar(120)')
    .addColumn('version', 'integer', (col) => col.notNull().defaultTo(0))

    .addColumn('createdAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .addColumn('updatedAt', 'timestamptz', (col) => col.defaultTo(sql`now()`).notNull())
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.dropTable(tableName).execute();
}
