import * as app from './app';
import { dbConfig } from './database';
import pinoLogger from './pino-logger';

export default { ...app, dbConfig, pinoLogger };
