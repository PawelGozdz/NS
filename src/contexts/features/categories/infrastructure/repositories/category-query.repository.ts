import { Injectable } from '@nestjs/common';

import { Database, ICategoriesQueryParams, TableNames } from '@app/core';

import { CategoryInfo, ICategoriesQueryRepository } from '../../domain';
import { CategoryModel } from '../models';

@Injectable()
export class CategoriesQueryRepository implements ICategoriesQueryRepository {
  constructor(readonly db: Database) {}

  async getManyBy(queryProps: ICategoriesQueryParams): Promise<CategoryInfo[]> {
    const { _filter } = queryProps;

    let query = this.getCategory();

    if (typeof _filter?.id === 'number') {
      query = query.where('c.id', '=', _filter.id);
    }

    if (_filter?.name) {
      query = query.where('c.name', 'ilike', `%${_filter.name}%`);
    }

    if (typeof _filter?.parentId === 'number') {
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
    };
  }

  private getCategory() {
    return this.db
      .selectFrom(`${TableNames.CATEGORIES} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
  }
}
