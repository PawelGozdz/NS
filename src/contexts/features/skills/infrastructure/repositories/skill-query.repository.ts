import { Injectable } from '@nestjs/common';

import { Database, ISkillsQueryParams, TableNames } from '@app/core';

import { ISkillsQueryRepository, SkillInfo } from '../../domain';
import { SkillModel } from '../models';

@Injectable()
export class SkillsQueryRepository implements ISkillsQueryRepository {
  constructor(readonly db: Database) {}

  async getManyBy(queryProps: ISkillsQueryParams): Promise<SkillInfo[]> {
    const { _filter } = queryProps;

    let query = this.getBuilder();

    if (typeof _filter?.id === 'number') {
      query = query.where('c.id', '=', _filter.id);
    }

    if (_filter?.name) {
      query = query.where('c.name', '=', _filter.name);
    }

    if (_filter?.context) {
      query = query.where('c.context', '=', _filter.context);
    }

    if (typeof _filter?.parentId === 'number') {
      query = query.where('c.parentId', '=', _filter.parentId);
    }

    const entities = await query.execute();

    return entities.map(this.mapResponse);
  }

  mapResponse(model: SkillModel): SkillInfo {
    return {
      id: model.id,
      name: model.name,
      description: model.description ?? null,
      parentId: model.parentId ?? null,
      context: model.context,
    };
  }

  private getBuilder() {
    return this.db
      .selectFrom(`${TableNames.SKILLS} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.context', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
  }
}
