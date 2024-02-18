import { Database, TableNames } from '@app/database';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';

import { AppContext } from '@libs/common';
import { Category, CategoryCreatedEvent, CategorySnapshot, CategoryUpdatedEvent, ICategoriesCommandRepository } from '../../../domain';
import { CategoryModel } from '../../models';

@Injectable()
export class CategoriesCommandRepository extends EntityRepository implements ICategoriesCommandRepository {
	constructor(
		eventBus: EventBus,
		readonly db: Database,
	) {
		super(eventBus, CategoryModel, db);
	}

	async getOneById(id: number): Promise<Category | undefined> {
		const entity = (await this.getCategory().where('c.id', '=', id).executeTakeFirst()) as CategoryModel | undefined;

		if (!entity) {
			return undefined;
		}

		const snapshot = this.categoryToSnapshot(entity);

		return Category.restoreFromSnapshot(snapshot);
	}

	async getOneByNameAndContext(name: string, context: AppContext): Promise<Category | undefined> {
		const entity = (await this.getCategory().where('c.name', '=', name).where('c.context', '=', context).executeTakeFirst()) as
			| CategoryModel
			| undefined;

		if (!entity) {
			return undefined;
		}

		const snapshot = this.categoryToSnapshot(entity);

		return Category.restoreFromSnapshot(snapshot);
	}

	public save(category: Category): Promise<void> {
		return this.handleUncommittedEvents(category);
	}

	private categoryToSnapshot(model: CategoryModel): CategorySnapshot {
		return {
			id: model.id,
			name: model.name,
			description: model.description,
			context: model.context,
			parentId: model.parentId,
			version: model.version,
		};
	}

	private getCategory() {
		return this.db
			.selectFrom(`${TableNames.CATEGORIES} as c`)
			.select((_eb) => ['c.id', 'c.name', 'c.description', 'c.context', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
	}

	public async handleCategoryUpdatedEvent(event: CategoryUpdatedEvent, trx: Transaction<any>) {
		await trx
			.updateTable(TableNames.CATEGORIES)
			.set({
				id: event.id,
				name: event.name,
				description: event.description,
				parentId: event.parentId,
			})
			.where('id', '=', event.id)
			.executeTakeFirstOrThrow();
	}

	public async handleCategoryCreatedEvent(event: CategoryCreatedEvent, trx: Transaction<any>) {
		await trx
			.insertInto(TableNames.CATEGORIES)
			.values({
				name: event.name,
				description: event.description,
				context: event.context,
				parentId: event.parentId,
			})
			.returning('id')
			.executeTakeFirstOrThrow();
	}
}
