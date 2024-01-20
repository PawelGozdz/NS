import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
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

export async function down(db: Kysely<any>): Promise<void> {
	const compiledQuery = sql`DROP FUNCTION on_update_timestamp`;
	await compiledQuery.execute(db);
}
