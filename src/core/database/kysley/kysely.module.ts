import config from '@app/config';
import { Global, Module } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

import { ConfigurableDatabaseModule, Database, dialect, kyselyPlugins } from './kysely.config';

const providers = [
	{
		provide: Database,
		useFactory: (logger: PinoLogger) =>
			new Database({
				dialect,
				log(event) {
					logger.info('Query:', event.query.sql);
					if (config.app.DATABASE_LOGGING && event.level === config.app?.DATABASE_LOGGING_LEVEL) {
						logger.info('Parameters:', event.query.parameters);
					}
				},
				plugins: kyselyPlugins,
			}),
		inject: [PinoLogger],
	},
];

@Global()
@Module({
	exports: [Database],
	providers: [...providers],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
