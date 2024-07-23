import { Kysely } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../../table-names';

const tableName = TableNames.SKILLS;
const constraintTableName = TableNames.CATEGORIES;
const foreignKey = 'skills_category_id_categories_id_fk';

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName).addColumn('categoryId', 'integer').execute();

  await db.schema
    .alterTable(tableName)
    .addForeignKeyConstraint(foreignKey, ['categoryId'], constraintTableName, ['id'])
    .onDelete('cascade')
    .execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName).dropConstraint(foreignKey).execute();
  await db.schema.alterTable(tableName).dropColumn('categoryId').execute();
}
