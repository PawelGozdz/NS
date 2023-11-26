import appConfig from '@config/app';

const { DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USER, DATABASE_HOST, DATABASE_LOGGING, DATABASE_SCHEMA } = appConfig;

export default {
	connection: {
		host: DATABASE_HOST,
		port: DATABASE_PORT,
		database: DATABASE_NAME,
		user: DATABASE_USER,
		password: DATABASE_PASSWORD,
		schema: DATABASE_SCHEMA,
		charset: 'utf8',
	},
	debug: DATABASE_LOGGING,
};
