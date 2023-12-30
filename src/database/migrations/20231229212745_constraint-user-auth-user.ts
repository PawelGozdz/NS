import { Knex } from 'knex';

const tableName = 'auth_users';
const constraintTableName = 'users';
const foreignKey = 'users_auth_users_user_id_fk';

export async function up(knex: Knex): Promise<void> {
	return knex.schema.raw(`
    ALTER TABLE ${tableName}
    ADD CONSTRAINT ${foreignKey} FOREIGN KEY (user_id) REFERENCES ${constraintTableName}(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  `);
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.raw(`
    ALTER TABLE ${tableName}
    DROP CONSTRAINT ${foreignKey};
  `);
}
