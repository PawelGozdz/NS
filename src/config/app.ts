/* eslint-disable import/no-named-as-default-member */
import dotenv from 'dotenv';
import { z } from 'zod';

export enum Environment {
  PRODUCTION = 'production',
  QA = 'qa',
  DEVELOPMENT = 'development',
  TEST = 'test',
}

if (process.env.NODE_ENV !== Environment.TEST) {
  dotenv.config();
}

export const globalVersioning = '1';
export const v1 = 'v1';
export const globalPrefix = 'api';
export const nodeVersion = '20.7.0-alpine';

const envSchema = z.object({
  PORT: z.coerce.number().positive().max(9999).default(3000),
  DEBUG_PORT: z.coerce.number().positive().max(9999).default(9229),
  NODE_ENV: z.nativeEnum(Environment),
  APP_NAME: z.string(),
  APP_VERSION: z.string(),
  LOG_LEVEL: z.string().optional(),
  NODE_VERSION: z.string().default(nodeVersion),
  DATABASE_NAME: z.string(),
  DATABASE_PORT: z.coerce.number().positive().max(65000),
  DATABASE_USER: z.string(),
  DATABASE_PASSWORD: z.string(),
  DATABASE_LOGGING: z.string().transform((val) => val === 'true'),
  DATABASE_LOGGING_LEVEL: z.string().optional(),
  DATABASE_HOST: z.string(),
  DATABASE_SCHEMA: z.string().default('public'),

  // AUTH
  JWT_ACCESS_TOKEN_SECRET: z.string(),
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: z.string(),
  JWT_REFRESH_TOKEN_SECRET: z.string(),
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: z.string(),

  // JAEGER
  JAEGER_URL: z.string().optional(),

  // MASKING
  MASKING_ENABLED: z
    .string()
    .transform((val) => val === 'true')
    .default('true'),

  // THROTTLER
  THROTTLER_TTL: z.coerce.number().positive(),
  THROTTLER_LIMIT: z.coerce.number().positive(),
});

export type Env = z.infer<typeof envSchema>;

export const appConfig = envSchema.parse(process.env);
