import { Knex } from 'knex';
import { helpers } from '../helpers';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
	return knex.schema
		.createTable(tableName, (t) => {
			t.uuid('id').primary();
			t.string('email').notNullable().unique();
			t.integer('version').defaultTo(0).notNullable();
			t.timestamps(true, true);
		})
		.then(() => knex.raw(helpers.onUpdateTrigger(tableName)));
}

export async function down(knex: Knex): Promise<void> {
	return knex.schema.dropTable(tableName);
}
