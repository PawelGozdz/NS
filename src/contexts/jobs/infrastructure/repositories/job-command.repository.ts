import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';

import { IDatabaseModels, TableNames } from '@app/core';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository, IEntityRepository } from '@libs/ddd';

import { IJobCommandRepository, Job, JobCreatedEvent, JobEvents, JobSnapshot, JobUpdatedEvent } from '../../domain';
import { JobModel } from '../models';

@Injectable()
export class JobCommandRepository extends EntityRepository implements IJobCommandRepository, IEntityRepository<JobEvents> {
  constructor(
    eventBus: EventBus,
    private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>,
  ) {
    super(eventBus, JobModel, txHost);
  }

  async getOneById(id: EntityId): Promise<Job | undefined> {
    const entity = (await this.getBuilder().where('c.id', '=', id.value).executeTakeFirst()) as JobModel | undefined;

    if (!entity) {
      return undefined;
    }

    const snapshot = this.toSnapshot(entity);

    return Job.restoreFromSnapshot(snapshot);
  }

  public async save(entity: Job): Promise<void> {
    return this.handleUncommittedEvents(entity);
  }

  private toSnapshot(model: JobModel): JobSnapshot {
    return {
      id: model.id,
      title: model.title ?? null,
      isActive: model.isActive,
      description: model.description,
      organizationId: model.orgatnizationId,
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
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
      version: model.version,
    };
  }

  private getBuilder() {
    return this.txHost.tx
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
        'c.version',
      ]);
  }

  public async handleJobUpdatedEvent(event: JobUpdatedEvent) {
    await this.db.tx
      .updateTable(TableNames.JOBS)
      .set({
        title: event.title,
        description: event.description,
        jobPositionId: event.jobPositionId,
        location: event.location,
        categoryIds: event.categoryIds,
        salaryRange: event.salaryRange,
        requiredSkills: event.requiredSkills,
        nicetoHaveSkills: event.niceToHaveSkills,
        requirements: event.requirements,
        languages: event.languages,
        benefits: event.benefits,
        startDate: event.startDate,
        endDate: event.endDate,
        publicationDate: event.publicationDate,
        expireDate: event.expireDate,
        contact: event.contact,
      })
      .where('id', '=', event.id.value)
      .executeTakeFirstOrThrow();
  }

  public async handleJobCreatedEvent(event: JobCreatedEvent) {
    await this.db.tx
      .insertInto(TableNames.JOBS)
      .values({
        id: event.id.value,
        title: event.title,
        isActive: event.isActive,
        description: event.description,
        orgatnizationId: event?.organizationId?.value,
        jobPositionId: event.jobPositionId.value,
        location: event.location,
        categoryIds: event.categoryIds,
        salaryRange: event.salaryRange,
        requiredSkills: event.requiredSkills,
        nicetoHaveSkills: event.niceToHaveSkills,
        requirements: event.requirements,
        languages: event.languages,
        benefits: event.benefits,
        startDate: event.startDate,
        endDate: event.endDate,
        publicationDate: event.publicationDate,
        expireDate: event.expireDate,
        contact: event.contact,
      })
      .execute();
  }
}
