import { Knex } from 'knex';

const tableName = 'event_log';

export async function up(knex: Knex): Promise<void> {
	await knex.schema.raw(`
      create table ${tableName}
      (
          id         bigint                   not null generated always as identity primary key,
          data       json                     not null,
          created_at timestamp with time zone not null default now(),
          event_name text                     not null
      );
  `);
}

export async function down(knex: Knex): Promise<void> {
	await knex.schema.raw(`drop table ${tableName};`);
}
