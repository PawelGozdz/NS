/* eslint-disable @typescript-eslint/brace-style */
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';

import { Certification, Education, Experience, IDatabaseModels, TableNames } from '@app/core';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository, IEntityRepository } from '@libs/ddd';

import {
  IJobUserProfileCommandRepository,
  JobUserProfile,
  JobUserProfileCreatedEvent,
  JobUserProfileEvents,
  JobUserProfileSnapshot,
  JobUserProfileUpdatedEvent,
} from '../../domain';
import { JobUserProfileModel } from '../models';

@Injectable()
export class JobUserProfileCommandRepository
  extends EntityRepository
  implements IJobUserProfileCommandRepository, IEntityRepository<JobUserProfileEvents>
{
  constructor(
    eventBus: EventBus,
    private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>,
  ) {
    super(eventBus, JobUserProfileModel, txHost);
  }

  async getOneById(id: EntityId): Promise<JobUserProfile | undefined> {
    const entity = (await this.getBuilder().where('c.id', '=', id.value).executeTakeFirst()) as JobUserProfileModel | undefined;

    if (!entity) {
      return undefined;
    }

    const snapshot = this.toSnapshot(entity);

    return JobUserProfile.restoreFromSnapshot(snapshot);
  }

  async getOneByUserId(userId: EntityId): Promise<JobUserProfile | undefined> {
    const entity = (await this.getBuilder().where('c.userId', '=', userId.value).executeTakeFirst()) as JobUserProfileModel | undefined;

    if (!entity) {
      return undefined;
    }

    const snapshot = this.toSnapshot(entity);

    return JobUserProfile.restoreFromSnapshot(snapshot);
  }

  public async save(entity: JobUserProfile): Promise<void> {
    return this.handleUncommittedEvents(entity);
  }

  private toSnapshot(model: JobUserProfileModel): JobUserProfileSnapshot {
    return {
      id: model.id,
      userId: model.userId,
      bio: model.bio,
      salaryRange: {
        from: model.salaryRange.from,
        to: model.salaryRange.to,
      },
      certificates: model.certificates.map((c) => ({ name: c.name, institution: c.institution, completionYear: c.completionYear })),
      education: model.education.map((e) => ({ degree: e.degree, institution: e.institution, graduateYear: e.graduateYear })),
      experience: model.experience.map((e) => ({
        skillId: e.skillId,
        experienceInMonths: e.experienceInMonths,
        startDate: e.startDate,
        endDate: e.endDate,
      })),
      jobPositionIds: model.jobPositionIds,
      jobIds: model.jobIds,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      version: model.version,
    };
  }

  private getBuilder() {
    return this.txHost.tx
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
        'c.version',
      ]);
  }

  public async handleJobUserProfileUpdatedEvent(event: JobUserProfileUpdatedEvent) {
    await this.db.tx
      .updateTable(TableNames.JOB_USER_PROFILES)
      .set({
        bio: event.bio,
        certificates: JSON.stringify(event.certificates) as unknown as Certification[],
        education: JSON.stringify(event.education) as unknown as Education[],
        experience: JSON.stringify(event.experience) as unknown as Experience[],
        jobPositionIds: event.jobPositionIds.map((jp) => jp.value),
        salaryRange: event.salaryRange,
        jobIds: event.jobIds.map((j) => j.value),
      })
      .where('id', '=', event.id.value)
      .executeTakeFirstOrThrow();
  }

  public async handleJobUserProfileCreatedEvent(event: JobUserProfileCreatedEvent) {
    await this.db.tx
      .insertInto(TableNames.JOB_USER_PROFILES)
      .values({
        id: event.id.value,
        userId: event.userId.value,
        bio: event.bio,
        certificates: JSON.stringify(event.certificates) as unknown as Certification[],
        education: JSON.stringify(event.education) as unknown as Education[],
        experience: JSON.stringify(event.experience) as unknown as Experience[],
        jobPositionIds: event.jobPositionIds.map((jp) => jp.value),
        salaryRange: event.salaryRange,
        jobIds: event.jobIds.map((j) => j.value),
      } as JobUserProfileModel)
      .execute();
  }
}
