import { Knex } from 'knex';
import { helpers } from '../helpers';

const tableName = 'auth_users';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable(tableName, (t) => {
			t.uuid('id').primary();
			t.string('email').notNullable().unique();
			t.uuid('user_id').notNullable().unique();
			t.string('hash').notNullable();
			t.string('hashed_rt').nullable();

			t.string('last_login').nullable();
			t.string('token_refreshed_at').nullable();

			t.timestamps(true, true);
		})
		.then(() => knex.raw(helpers.onUpdateTrigger(tableName)));
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(tableName);
}
