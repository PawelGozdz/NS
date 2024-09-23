import { Injectable } from '@nestjs/common';

import { Database, ISkillsQueryParams, TableNames } from '@app/core';

import { ISkillsQueryRepository, SkillInfo } from '../../domain';
import { SkillModel } from '../models';

@Injectable()
export class SkillsQueryRepository implements ISkillsQueryRepository {
  constructor(readonly db: Database) {}

  async getManyBy(queryProps: ISkillsQueryParams): Promise<SkillInfo[]> {
    const { _filter } = queryProps;

    const ids: number[] = [];

    let query = this.getBuilder();

    if (typeof _filter?.id === 'number') {
      ids.push(_filter.id);
    }

    if (_filter?.ids) {
      ids.push(..._filter.ids);
    }

    if (ids.length > 0) {
      query = query.where('c.id', 'in', ids);
    }

    if (_filter?.name) {
      query = query.where('c.name', '=', _filter.name);
    }

    const entities = await query.execute();

    return entities.map(this.mapResponse);
  }

  mapResponse(model: SkillModel): SkillInfo {
    return {
      id: model.id,
      name: model.name,
      description: model.description ?? null,
      categoryId: model.categoryId,
    };
  }

  private getBuilder() {
    return this.db
      .selectFrom(`${TableNames.SKILLS} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.categoryId', 'c.createdAt', 'c.updatedAt']);
  }
}
