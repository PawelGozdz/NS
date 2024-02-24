import { DatabaseModule } from '@app/core';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';

import { CreateCategoryHandler, GetManyCategoriesHandler, UpdateCategoryHandler } from './application';
import { ICategoriesCommandRepository, ICategoriesQueryRepository } from './domain';
import { CategoriesCommandRepository, CategoriesQueryRepository } from './infrastructure';

const providers = [
	{
		provide: ICategoriesCommandRepository,
		useClass: CategoriesCommandRepository,
	},
	{
		provide: ICategoriesQueryRepository,
		useClass: CategoriesQueryRepository,
	},
];
const queries = [GetManyCategoriesHandler];
const commands = [CreateCategoryHandler, UpdateCategoryHandler];
@Module({
	imports: [CqrsModule, DatabaseModule],
	providers: [...providers, ...queries, ...commands],
	exports: [...providers, ...queries, ...commands],
})
export class CategoriesModule {}
