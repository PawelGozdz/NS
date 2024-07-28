import { Kysely } from 'kysely';

import { IDatabaseModels } from '../../models';
import { TableNames } from '../../table-names';

const tableName1 = TableNames.SKILLS;

const constrantKey = 'skills_category_id_skill_name_fk';

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName1).addUniqueConstraint(constrantKey, ['name', 'categoryId']).execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName1).dropConstraint(constrantKey).execute();
}
