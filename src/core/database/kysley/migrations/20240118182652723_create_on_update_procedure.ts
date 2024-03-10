// eslint-disable @typescript-eslint/no-explicit-any

import { Kysely, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

export async function up(db: Kysely<IDatabaseModels>): Promise<void> {
  const compiledQuery = sql`
        CREATE OR REPLACE FUNCTION on_update_timestamp()
        RETURNS trigger AS $$
        BEGIN
        NEW.updated_at = now();
        RETURN NEW;
        END;
        $$ language 'plpgsql';
    `;
  await compiledQuery.execute(db);
}

export async function down(db: Kysely<IDatabaseModels>): Promise<void> {
  const compiledQuery = sql`DROP FUNCTION on_update_timestamp`;
  await compiledQuery.execute(db);
}
