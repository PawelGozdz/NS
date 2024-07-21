import { Kysely } from 'kysely';

import { SkillModel } from '@app/contexts';
import { IDatabaseModels, TableNames, dialect, kyselyPlugins } from '@app/core';

import { SkillFixtureFactory } from '../fixtures';

type IDatabaseDaos = IDatabaseModels;

export class SkillSeedBuilder {
  public dbConnection: Kysely<IDatabaseDaos>;

  public skillDao: SkillModel;

  daos: {
    skillDaoObj: SkillModel | undefined;
  } = { skillDaoObj: undefined };

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

  withSkill(model?: Partial<SkillModel>): this {
    this.daos.skillDaoObj = SkillFixtureFactory.create({
      ...model,
    });

    this.actions.push({ method: 'insertSkill' });

    return this;
  }
}
