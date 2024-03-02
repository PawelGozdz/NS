import { Injectable } from '@nestjs/common';

import { Database, TableNames } from '@app/core';
import { throwErrorBasedOnPostgresErrorCode } from '@libs/common';

import { Category, ICategoriesCommandRepository, ICategoryCreateData, ICategoryUpdateData } from '../../domain';
import { CategoryModel } from '../models';

@Injectable()
export class CategoriesCommandRepository implements ICategoriesCommandRepository {
  constructor(readonly db: Database) {}

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
      const entity = await this.getCategory().where('c.name', '=', name).where('c.ctx', '=', context).executeTakeFirst();

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
      const model = await this.db
        .insertInto(TableNames.CATEGORIES)
        .values({
          name: category.name,
          description: category.description,
          ctx: category.ctx,
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
      await this.db
        .updateTable(TableNames.CATEGORIES)
        .set({
          name: category.name,
          description: category.description,
          ctx: category.ctx,
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
      ctx: model.ctx,
    });
  }

  private getCategory() {
    return this.db
      .selectFrom(`${TableNames.CATEGORIES} as c`)
      .select((_eb) => ['c.id', 'c.name', 'c.description', 'c.ctx', 'c.parentId', 'c.createdAt', 'c.updatedAt']);
  }
}
