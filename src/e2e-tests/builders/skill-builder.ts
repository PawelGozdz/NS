import { Kysely } from 'kysely';

import { CategoryModel, SkillModel } from '@app/contexts';
import { IDatabaseModels, TableNames, dialect, kyselyPlugins } from '@app/core';

import { CategoryFixtureFactory, SkillFixtureFactory } from '../fixtures';

type IDatabaseDaos = IDatabaseModels;

export class SkillSeedBuilder {
  public dbConnection: Kysely<IDatabaseDaos>;

  public skillDao: SkillModel;

  public categoryDao: CategoryModel;

  daos: {
    skillDaoObj: SkillModel | undefined;
    categoryDaoObj: CategoryModel | undefined;
  } = { skillDaoObj: undefined, categoryDaoObj: undefined };

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

  static async create(db?: Kysely<IDatabaseDaos>): Promise<SkillSeedBuilder> {
    const builder = new SkillSeedBuilder(
      db ??
        new Kysely<IDatabaseDaos>({
          dialect,
          plugins: kyselyPlugins,
        }),
    );

    return builder;
  }

  private async insertSkill() {
    if (!this.daos.skillDaoObj) {
      throw new Error('skillDaoObj is not defined');
    }

    this.skillDao = (await this.dbConnection
      .insertInto(TableNames.SKILLS)
      .values(this.daos.skillDaoObj)
      .returningAll()
      .executeTakeFirst()) as SkillModel;
  }

  private async insertCategory() {
    if (!this.daos.categoryDaoObj) {
      throw new Error('categoryDaoObj is not defined');
    }

    this.categoryDao = (await this.dbConnection
      .insertInto(TableNames.CATEGORIES)
      .values(this.daos.categoryDaoObj)
      .returningAll()
      .executeTakeFirst()) as CategoryModel;

    if (this.daos.skillDaoObj) {
      this.daos.skillDaoObj.categoryId = this.categoryDao.id;
    }
  }

  withSkill(model?: Partial<SkillModel>): this {
    this.daos.skillDaoObj = SkillFixtureFactory.create({
      ...model,
      categoryId: this.daos.categoryDaoObj?.id,
    });

    this.actions.push({ method: 'insertSkill' });

    return this;
  }

  withCategory(model?: Partial<CategoryModel>): this {
    this.daos.categoryDaoObj = CategoryFixtureFactory.create({
      ...model,
    });

    this.actions.push({ method: 'insertCategory' });

    return this;
  }
}
