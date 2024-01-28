import { Global, Module } from '@nestjs/common';

import { ConfigurableDatabaseModule, Database, dialect, kyselyPlugins } from './kysely.config';

@Global()
@Module({
	exports: [Database],
	providers: [
		{
			provide: Database,
			useFactory: () => {
				return new Database({
					dialect,
					log(event) {
						if (event.level === 'query') {
							console.log('Query:', event.query.sql);
							console.log('Parameters:', event.query.parameters);
						}
					},
					plugins: kyselyPlugins,
				});
			},
		},
	],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
