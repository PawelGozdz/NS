import { TableNames } from '@app/database/table-names';
import { Kysely, sql } from 'kysely';
import { onUpdateTrigger } from '../helpers';

const tableName = TableNames.AUTH_USERS;
const onUpdateTriggerQuery = onUpdateTrigger(tableName);

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable(tableName)
		.addColumn('id', 'uuid', (col) => col.primaryKey())
		.addColumn('email', 'varchar', (col) => col.notNull().unique())
		.addColumn('user_id', 'uuid', (col) => col.notNull().unique())
		.addColumn('hash', 'varchar', (col) => col.notNull())
		.addColumn('hashed_rt', 'varchar')
		.addColumn('last_login', 'varchar')
		.addColumn('token_refreshed_at', 'varchar')

		.addColumn('created_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.addColumn('updated_at', 'timestamp', (col) => col.defaultTo(sql`now()`).notNull())
		.execute()
		.then(() => sql.raw(`${onUpdateTriggerQuery}`).execute(db));
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable(tableName).execute();
}
