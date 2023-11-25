import { z } from 'zod';

export enum Environment {
	PRODUCTION = 'production',
	QA = 'qa',
	DEVELOPMENT = 'development',
}
export const appName = 'temp-name';

const envSchema = z.object({
	PORT: z.coerce.number().positive().max(9999),
	NODE_ENV: z.nativeEnum(Environment),
	APP_NAME: z.literal(appName),
	LOG_LEVEL: z.string(),
});

export type Env = z.infer<typeof envSchema>;

export default envSchema.parse(process.env);
