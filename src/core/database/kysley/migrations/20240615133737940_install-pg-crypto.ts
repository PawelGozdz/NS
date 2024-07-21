/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  const compiledQuery = sql`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `;
  await compiledQuery.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  const compiledQuery = sql`
    DROP EXTENSION IF EXISTS pgcrypto;
  `;
  await compiledQuery.execute(db);
}
