import { Global, Module } from '@nestjs/common';

import { CamelCasePlugin } from 'kysely';
import { ConfigurableDatabaseModule, Database, dialect } from './kysely.config';

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
					plugins: [new CamelCasePlugin()],
				});
			},
		},
	],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
