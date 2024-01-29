import { Global, Module } from '@nestjs/common';

import { ConfigurableDatabaseModule, Database, dialect, kyselyPlugins } from './kysely.config';

const providers = [
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
];

@Global()
@Module({
	exports: [Database],
	providers: [...providers],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
