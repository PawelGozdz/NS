import { Injectable } from '@nestjs/common';

import { Database, IJobPositionQueryParams, TableNames } from '@app/core';
import { EntityId } from '@libs/common';

import { IJobPositionQueryRepository, JobPositionInfo } from '../../domain';
import { JobPositionModel } from '../models';

@Injectable()
export class JobPositionQueryRepository implements IJobPositionQueryRepository {
  constructor(readonly db: Database) {}

  public async getOneById(id: EntityId): Promise<JobPositionInfo | undefined> {
    const entity = (await this.getBuilder().where('id', '=', id.value).executeTakeFirst()) as JobPositionModel | undefined;

    if (!entity) {
      return undefined;
    }

    return this.mapResponse(entity);
  }

  async getManyBy(queryProps: IJobPositionQueryParams): Promise<JobPositionInfo[]> {
    const { _filter } = queryProps;

    let query = this.getBuilder();

    if (typeof _filter?.id === 'number') {
      query = query.where('c.id', '=', _filter.id);
    }

    if (_filter?.title) {
      query = query.where('c.title', '=', _filter.title);
    }

    if (_filter?.categoryId) {
      query = query.where('c.categoryId', '=', _filter.categoryId);
    }

    if (_filter?.skillIds) {
      query = query.where('c.skillIds', '&&', _filter.skillIds);
    }

    const entities = await query.execute();

    return entities.map(this.mapResponse);
  }

  mapResponse(model: JobPositionModel): JobPositionInfo {
    return {
      id: model.id,
      title: model.title,
      skillIds: model.skillIds,
      categoryId: model.categoryId,
    };
  }

  private getBuilder() {
    return this.db
      .selectFrom(`${TableNames.JOB_POSITIONS} as c`)
      .select((_eb) => ['c.id', 'c.title', 'c.categoryId', 'c.skillIds', 'c.createdAt', 'c.updatedAt']);
  }
}
