/* eslint-disable @typescript-eslint/brace-style */
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';

import { IDatabaseModels, TableNames } from '@app/core';
import { EntityId, throwErrorBasedOnPostgresErrorCode } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';

import { IJobPositionCommandRepository, IJobPositionUpdateData, JobPosition, JobPositionSnapshot } from '../../domain';
import { JobPositionModel } from '../models';

@Injectable()
export class JobPositionCommandRepository extends EntityRepository implements IJobPositionCommandRepository {
  constructor(
    eventBus: EventBus,
    private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>,
  ) {
    super(eventBus, JobPositionModel, txHost);
  }

  async getOneById(id: EntityId): Promise<JobPosition | undefined> {
    const entity = (await this.getBuilder().where('c.id', '=', id.value).executeTakeFirst()) as JobPositionModel | undefined;

    if (!entity) {
      return undefined;
    }

    const snapshot = this.toSnapshot(entity);

    return JobPosition.restoreFromSnapshot(snapshot);
  }

  public async save(position: JobPosition): Promise<{ id: string }> {
    try {
      const model = await this.txHost.tx
        .insertInto(TableNames.JOB_POSITIONS)
        .values({
          id: position.id.value,
          title: position.title,
          categoryId: position.categoryId,
          skillIds: position.skillIds,
        } as JobPositionModel)
        .returning('id')
        .executeTakeFirstOrThrow();

      return {
        id: model.id,
      };
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  public async update(position: IJobPositionUpdateData): Promise<void> {
    try {
      await this.txHost.tx
        .updateTable(TableNames.JOB_POSITIONS)
        .set({
          title: position.title,
          categoryId: position.categoryId,
          skillIds: position.skillIds,
        })
        .where('id', '=', position.id.value)
        .execute();
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  private toSnapshot(model: JobPositionModel): JobPositionSnapshot {
    return {
      id: model.id,
      title: model.title,
      categoryId: model.categoryId,
      skillIds: model.skillIds,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    };
  }

  private getBuilder() {
    return this.txHost.tx
      .selectFrom(`${TableNames.JOB_POSITIONS} as c`)
      .select((_eb) => ['c.id', 'c.title', 'c.categoryId', 'c.skillIds', 'c.createdAt', 'c.updatedAt']);
  }
}
