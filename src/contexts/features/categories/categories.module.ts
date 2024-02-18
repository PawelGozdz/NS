import { DatabaseModule } from '@app/database/kysley';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';

import { CreateCategoryHandler } from './application';
import { ICategoriesCommandRepository } from './domain';
import { CategoriesCommandRepository } from './infrastructure';

const providers = [
	{
		provide: ICategoriesCommandRepository,
		useClass: CategoriesCommandRepository,
	},
	// {
	// 	provide: ICategoryQueryRepository,
	// 	useClass: CategoriesQueryRepository,
	// },
];
const queries = [];
const commands = [CreateCategoryHandler];

@Module({
	imports: [CqrsModule, DatabaseModule],
	providers: [...providers, ...queries, ...commands],
})
export class CategoriesModule {}
