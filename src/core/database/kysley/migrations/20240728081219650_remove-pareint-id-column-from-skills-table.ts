import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '../../models';
import { TableNames } from '../../table-names';

const tableName = TableNames.SKILLS;

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName).dropConstraint('check_parent').execute();
  await db.schema.alterTable(tableName).dropColumn('parentId').execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema
    .alterTable(tableName)
    .addColumn('parentId', 'integer', (col) => col.references(`${tableName}.id`).onDelete('cascade'))
    .execute();

  await db.schema
    .alterTable(tableName)
    .addCheckConstraint('check_parent', sql`id <> parent_id`)
    .execute();
}
