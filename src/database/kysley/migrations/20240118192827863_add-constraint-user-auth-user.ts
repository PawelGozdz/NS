import { TableNames } from '@app/database/table-names';
import { Kysely, sql } from 'kysely';

const tableName = TableNames.AUTH_USERS;
const constraintTableName = TableNames.USERS;
const foreignKey = 'users_auth_users_user_id_fk';

export async function up(db: Kysely<any>): Promise<void> {
	sql
		.raw(
			`ALTER TABLE ${tableName}
            ADD CONSTRAINT ${foreignKey} FOREIGN KEY (user_id) REFERENCES ${constraintTableName}(id)
            ON DELETE CASCADE
            ON UPDATE CASCADE;`,
		)
		.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
	sql.raw(`ALTER TABLE ${tableName} DROP CONSTRAINT ${foreignKey};`).execute(db);
}
