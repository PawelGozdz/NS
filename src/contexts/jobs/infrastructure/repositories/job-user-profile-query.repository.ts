import { Injectable } from '@nestjs/common';

import { Database, IJobUserProfileQueryParams, TableNames } from '@app/core';
import { EntityId } from '@libs/common';

import { IJobUserProfileQueryRepository, JobUserProfileInfo } from '../../domain';
import { JobUserProfileModel } from '../models';

@Injectable()
export class JobUserProfileQueryRepository implements IJobUserProfileQueryRepository {
  constructor(readonly db: Database) {}

  public async getOneById(id: EntityId): Promise<JobUserProfileInfo | undefined> {
    const entity = (await this.getBuilder().where('id', '=', id.value).executeTakeFirst()) as JobUserProfileModel | undefined;

    if (!entity) {
      return undefined;
    }

    return this.mapResponse(entity);
  }

  public async getOneByUserId(userId: EntityId): Promise<JobUserProfileInfo | undefined> {
    const entity = (await this.getBuilder().where('userId', '=', userId.value).executeTakeFirst()) as JobUserProfileModel | undefined;

    if (!entity) {
      return undefined;
    }

    return this.mapResponse(entity);
  }

  async getMany(queryProps: IJobUserProfileQueryParams): Promise<JobUserProfileInfo[]> {
    const { _filter } = queryProps;

    let query = this.getBuilder();

    if (typeof _filter?.id === 'number') {
      query = query.where('c.id', '=', _filter.id);
    }

    if (_filter?.userId) {
      query = query.where('c.userId', '=', _filter.userId);
    }

    const entities = await query.execute();

    return entities.map(this.mapResponse);
  }

  mapResponse(model: JobUserProfileModel): JobUserProfileInfo {
    return {
      id: model.id,
      userId: model.userId,
      bio: model.bio,
      salaryRange: {
        from: model.salaryRange.from,
        to: model.salaryRange.to,
      },
      jobPositionIds: model.jobPositionIds,
      certificates: model.certificates,
      education: model.education,
      experience: model.experience,
      jobIds: model.jobIds,
    };
  }

  private getBuilder() {
    return this.db
      .selectFrom(`${TableNames.JOB_USER_PROFILES} as c`)
      .select((_eb) => [
        'c.id',
        'c.userId',
        'c.bio',
        'c.salaryRange',
        'c.certificates',
        'c.education',
        'c.experience',
        'c.jobPositionIds',
        'c.jobIds',
        'c.createdAt',
        'c.updatedAt',
      ]);
  }
}
