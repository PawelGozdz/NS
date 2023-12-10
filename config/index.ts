import app from './app';
import db from './database';
import pinoLogger from './pino-logger';
import services from './services';
import settings from './settings';

export default [app, db, settings, services, pinoLogger];
