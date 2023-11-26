import { BaseModel } from '@libs/ddd';
import { Module, OnModuleInit } from '@nestjs/common';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import pg from 'pg';

import databaseConfig from './knexfile';

@Module({
	imports: [
		ObjectionModule.register({
			config: {
				...databaseConfig,
			},
			Model: BaseModel,
		}),
	],
	exports: [ObjectionModule],
})
export class DatabaseModule implements OnModuleInit {
	onModuleInit(): void {
		pg.types.setTypeParser(pg.types.builtins.NUMERIC, Number);
	}
}
