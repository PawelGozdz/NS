import { Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import config from '@app/config';

import { ConfigurableDatabaseModule, Database, dialect, kyselyPlugins } from './kysely.config';

const providers = [
  {
    provide: Database,
    useFactory: (logger: PinoLogger) =>
      new Database({
        dialect,
        log(event) {
          if (config.appConfig.DATABASE_LOGGING && event.level === config.appConfig?.DATABASE_LOGGING_LEVEL) {
            logger.info(event.query.sql, 'Query:');
            logger.info(event.query.parameters, 'Parameters:');
            logger.info(`Resolved in: ${Number(event.queryDurationMillis).toFixed(3)}ms`);
          }
        },
        plugins: kyselyPlugins,
      }),
    inject: [PinoLogger],
  },
];

@Module({
  exports: [Database],
  providers: [...providers],
})
export class KyselyDatabaseModule extends ConfigurableDatabaseModule {}
