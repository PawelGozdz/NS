import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '../../models';
import { TableNames } from '../../table-names';

const tableName1 = TableNames.CATEGORIES;
const tableName2 = TableNames.SKILLS;

const contextConstrant1 = 'categories_name_context_uq';
const contextConstrant2 = 'skills_name_context_uq';
const newConstrant1 = 'categories_name_parent_id_context_uq';

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  // Categories
  await db.schema.alterTable(tableName1).dropConstraint(contextConstrant1).execute();
  await db.schema.alterTable(tableName1).dropColumn('context').execute();

  // Skills
  await db.schema.alterTable(tableName2).dropConstraint(contextConstrant2).execute();
  await db.schema.alterTable(tableName2).dropColumn('context').execute();

  await sql.raw(`CREATE UNIQUE INDEX ${newConstrant1} ON ${tableName1} (name, COALESCE(parent_id, -1))`).execute(db);
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  // Categories
  await db.schema
    .alterTable(tableName1)
    .addColumn('context', 'varchar(15)', (col) => col.notNull())
    .execute();
  await db.schema.alterTable(tableName1).addUniqueConstraint(contextConstrant1, ['name', 'context']).execute();

  // Skills
  await db.schema
    .alterTable(tableName2)
    .addColumn('context', 'varchar(15)', (col) => col.notNull())
    .execute();
  await db.schema.alterTable(tableName2).addUniqueConstraint(contextConstrant2, ['name', 'context']).execute();

  await sql.raw(`DROP INDEX ${newConstrant1}`).execute(db);
}
