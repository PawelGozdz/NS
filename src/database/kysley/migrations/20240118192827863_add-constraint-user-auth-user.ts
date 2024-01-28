import { TableNames } from '@app/database/table-names';
import { Kysely } from 'kysely';

const tableName = TableNames.AUTH_USERS;
const constraintTableName = TableNames.USERS;
const foreignKey = 'users_auth_users_user_id_fk';

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable(tableName).addForeignKeyConstraint(foreignKey, ['userId'], constraintTableName, ['id']).execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.alterTable(tableName).dropConstraint(foreignKey).execute();
}
