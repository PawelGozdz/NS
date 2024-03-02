// eslint-disable @typescript-eslint/no-explicit-any
import { Kysely } from 'kysely';

import { IDatabaseModels } from '@libs/common';

import { TableNames } from '../../table-names';

const tableName = TableNames.AUTH_USERS;
const constraintTableName = TableNames.USERS;
const foreignKey = 'auth_users_user_id_users_id_fk';

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName).addForeignKeyConstraint(foreignKey, ['userId'], constraintTableName, ['id']).onDelete('cascade').execute();
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  await db.schema.alterTable(tableName).dropConstraint(foreignKey).execute();
}
