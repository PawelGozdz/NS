import { z } from 'zod';

export enum Environment {
	PRODUCTION = 'production',
	QA = 'qa',
	DEVELOPMENT = 'development',
}
export const appName = 'hunt-it';

export const globalVersioning = '1';
export const v1 = 'v1';
export const globalPrefix = `api`;

const envSchema = z.object({
	PORT: z.coerce.number().positive().max(9999),
	DEBUG_PORT: z.coerce.number().positive().max(9999),
	NODE_ENV: z.nativeEnum(Environment),
	APP_NAME: z.literal(appName),
	LOG_LEVEL: z.string(),
	NODE_VERSION: z.string(),
	DATABASE_NAME: z.string(),
	DATABASE_PORT: z.coerce.number().positive().max(9999),
	DATABASE_USER: z.string(),
	DATABASE_PASSWORD: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export default envSchema.parse(process.env);
