import appConfig from './app';

const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER, DATABASE_HOST, DATABASE_LOGGING, DATABASE_SCHEMA } = appConfig;

export interface IDatabaseOptions {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	schema: string;
	charset: string;
}

export const dbConfig = {
	connection: {
		host: DATABASE_HOST,
		port: DATABASE_PORT,
		database: DATABASE_NAME,
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		schema: DATABASE_SCHEMA,
		charset: 'utf8',
	} as IDatabaseOptions,
	debug: DATABASE_LOGGING,
};
