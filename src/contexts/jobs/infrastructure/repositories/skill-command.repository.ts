import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';

import { IDatabaseModels, TableNames } from '@app/core';
import { throwErrorBasedOnPostgresErrorCode } from '@libs/common';

import { ISkillCreateData, ISkillsCommandRepository, Skill } from '../../domain';
import { SkillModel } from '../models';

@Injectable()
export class SkillsCommandRepository implements ISkillsCommandRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>) {}

  async getOneById(id: number): Promise<Skill | undefined> {
    try {
      const entity = await this.getBuilder().where('c.id', '=', id).executeTakeFirst();

      if (!entity) {
        return undefined;
      }

      return this.mapResponse(entity);
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  async getOneByNameAndCategoryId(name: string, categoryId: number): Promise<Skill | undefined> {
    try {
      const entity = await this.getBuilder().where('c.name', '=', name).where('c.categoryId', '=', categoryId).executeTakeFirst();

      if (!entity) {
        return undefined;
      }

      return this.mapResponse(entity);
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  public async save(skill: ISkillCreateData): Promise<{ id: number }> {
    try {
      const model = await this.txHost.tx
        .insertInto(TableNames.SKILLS)
        .values({
          name: skill.name,
          description: skill.description,
          categoryId: skill.categoryId,
        } as SkillModel)
        .returning('id')
        .executeTakeFirstOrThrow();

      return {
        id: model.id,
      };
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  mapResponse(model: SkillModel): Skill {
    return new Skill({
      id: model.id,
      name: model.name,
      description: model.description,
      categoryId: model.categoryId,
    });
  }

  private getBuilder() {
    return this.txHost.tx
      .selectFrom(`${TableNames.SKILLS} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.categoryId', 'c.createdAt', 'c.updatedAt']);
  }
}
