import { Database, TableNames } from '@app/database';
import { Injectable } from '@nestjs/common';

import { ICategoriesQueryParams } from '@app/core';
import { CategoryInfo, ICategoriesQueryRepository } from '../../../domain';
import { CategoryModel } from '../../models';

@Injectable()
export class CategoriesQueryRepository implements ICategoriesQueryRepository {
	constructor(readonly db: Database) {}

	async getManyBy(queryProps: ICategoriesQueryParams): Promise<CategoryInfo[]> {
		const { _filter } = queryProps;

		let query = this.getCategory();

		if (_filter?.id) {
			query = query.where('c.id', '=', _filter.id);
		}

		if (_filter?.name) {
			query = query.where('c.name', '=', _filter.name);
		}

		if (_filter?.ctx) {
			query = query.where('c.ctx', '=', _filter.ctx);
		}

		if (_filter?.parentId) {
			query = query.where('c.parentId', '=', _filter.parentId);
		}

		const entities = await query.execute();

		return entities.map(this.mapResponse);
	}

	mapResponse(model: CategoryModel): CategoryInfo {
		return {
			id: model.id,
			name: model.name,
			description: model.description ?? null,
			parentId: model.parentId ?? null,
			ctx: model.ctx,
		};
	}

	private getCategory() {
		return this.db
			.selectFrom(`${TableNames.CATEGORIES} as c`)
			.select((_eb) => ['c.id', 'c.name', 'c.description', 'c.ctx', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
	}
}
