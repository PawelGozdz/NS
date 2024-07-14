import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';

import { IDatabaseModels, TableNames } from '@app/core';
import { throwErrorBasedOnPostgresErrorCode } from '@libs/common';

import { Category, ICategoriesCommandRepository, ICategoryCreateData, ICategoryUpdateData } from '../../domain';
import { CategoryModel } from '../models';

@Injectable()
export class CategoriesCommandRepository implements ICategoriesCommandRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>) {}

  async getOneById(id: number): Promise<Category | undefined> {
    try {
      const entity = await this.getCategory().where('c.id', '=', id).executeTakeFirst();

      if (!entity) {
        return undefined;
      }

      return this.mapResponse(entity);
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  async getOneByNameAndContext(name: string, context: string): Promise<Category | undefined> {
    try {
      const entity = await this.getCategory().where('c.name', '=', name).where('c.context', '=', context).executeTakeFirst();

      if (!entity) {
        return undefined;
      }

      return this.mapResponse(entity);
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  public async save(category: ICategoryCreateData): Promise<{ id: number }> {
    try {
      const model = await this.txHost.tx
        .insertInto(TableNames.CATEGORIES)
        .values({
          name: category.name,
          description: category.description,
          context: category.context,
          parentId: category.parentId,
        } as CategoryModel)
        .returning('id')
        .executeTakeFirstOrThrow();

      return {
        id: model.id,
      };
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  public async update(category: ICategoryUpdateData): Promise<void> {
    try {
      await this.txHost.tx
        .updateTable(TableNames.CATEGORIES)
        .set({
          name: category.name,
          description: category.description,
          context: category.context,
          parentId: category.parentId,
        })
        .where('id', '=', category.id)
        .execute();
    } catch (error) {
      throw throwErrorBasedOnPostgresErrorCode(error.code, error.message);
    }
  }

  mapResponse(model: CategoryModel): Category {
    return new Category({
      id: model.id,
      name: model.name,
      description: model.description,
      parentId: model.parentId,
      context: model.context,
    });
  }

  private getCategory() {
    return this.txHost.tx
      .selectFrom(`${TableNames.CATEGORIES} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.context', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
  }
}
