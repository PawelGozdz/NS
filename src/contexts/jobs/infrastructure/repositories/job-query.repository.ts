import { Injectable } from '@nestjs/common';

import { Database, IJobQueryParams, TableNames } from '@app/core';
import { EntityId } from '@libs/common';

import { IJobQueryRepository, JobInfo } from '../../domain';
import { JobModel } from '../models';

@Injectable()
export class JobQueryRepository implements IJobQueryRepository {
  constructor(readonly db: Database) {}

  public async getOneById(id: EntityId): Promise<JobInfo | undefined> {
    const entity = (await this.getBuilder().where('id', '=', id.value).executeTakeFirst()) as JobModel | undefined;

    if (!entity) {
      return undefined;
    }

    return this.mapResponse(entity);
  }

  async getMany(queryProps: IJobQueryParams): Promise<JobInfo[]> {
    const { _filter } = queryProps;

    let query = this.getBuilder();

    if (typeof _filter?.id === 'number') {
      query = query.where('c.id', '=', _filter.id);
    }

    const entities = (await query.execute()) as JobModel[];

    return entities.map(this.mapResponse);
  }

  mapResponse(model: JobModel): JobInfo {
    return {
      id: model.id,
      title: model.title ?? null,
      isActive: model.isActive,
      description: model.description ?? null,
      organizationId: model.orgatnizationId ?? null,
      jobPositionId: model.jobPositionId,
      location: model.location,
      categoryIds: model.categoryIds,
      salaryRange: model.salaryRange,
      requiredSkills: model.requiredSkills,
      niceToHaveSkills: model.niceToHaveSkills,
      requirements: model.requirements,
      languages: model.languages,
      benefits: model.benefits,
      startDate: model.startDate ?? null,
      endDate: model.endDate ?? null,
      publicationDate: model.publicationDate ?? null,
      expireDate: model.expireDate,
      contact: model.contact ?? null,
    };
  }

  private getBuilder() {
    return this.db
      .selectFrom(`${TableNames.JOBS} as c`)
      .select((_eb) => [
        'c.id',
        'c.title',
        'c.isActive',
        'c.description',
        'c.orgatnizationId',
        'c.jobPositionId',
        'c.location',
        'c.categoryIds',
        'c.salaryRange',
        'c.requiredSkills',
        'c.niceToHaveSkills',
        'c.requirements',
        'c.languages',
        'c.benefits',
        'c.startDate',
        'c.endDate',
        'c.publicationDate',
        'c.expireDate',
        'c.contact',
        'c.createdAt',
        'c.updatedAt',
      ]);
  }
}
