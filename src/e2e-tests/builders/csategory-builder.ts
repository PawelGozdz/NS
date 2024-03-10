import { Kysely } from 'kysely';

import { CategoryModel } from '@app/contexts';
import { IDatabaseModels, TableNames, dialect, kyselyPlugins } from '@app/core';

import { CategoryFixtureFactory } from '../fixtures';

type IDatabaseDaos = IDatabaseModels;

export class CategorySeedBuilder {
  public dbConnection: Kysely<IDatabaseDaos>;

  public categoryDao: CategoryModel;

  daos: {
    categoryDaoObj: CategoryModel | undefined;
  } = { categoryDaoObj: undefined };

  actions: { method: string }[] = [];

  private constructor(dbConnection: Kysely<IDatabaseDaos>) {
    this.dbConnection = dbConnection;
  }

  async build() {
    // eslint-disable-next-line no-restricted-syntax
    for await (const action of this.actions) {
      await this[action.method]();
    }

    this.actions = [];

    return this;
  }

  static async create(db?: Kysely<IDatabaseDaos>): Promise<CategorySeedBuilder> {
    const builder = new CategorySeedBuilder(
      db ??
        new Kysely<IDatabaseDaos>({
          dialect,
          plugins: kyselyPlugins,
        }),
    );

    return builder;
  }

  private async insertCategory() {
    if (!this.daos.categoryDaoObj) {
      throw new Error('CategoryDao is not defined');
    }

    this.categoryDao = (await this.dbConnection
      .insertInto(TableNames.CATEGORIES)
      .values(this.daos.categoryDaoObj)
      .returningAll()
      .executeTakeFirst()) as CategoryModel;
  }

  withCategory(category?: Partial<CategoryModel>): this {
    this.daos.categoryDaoObj = CategoryFixtureFactory.create({
      ...category,
    });

    this.actions.push({ method: 'insertCategory' });

    return this;
  }
}
