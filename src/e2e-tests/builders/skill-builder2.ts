/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, Transaction } from 'kysely';

import { CategoryModel, SkillModel } from '@app/contexts';
import { IDatabaseModels, TableNames } from '@app/core';

import { SkillFixtureFactory } from '../fixtures';
import { BaseSeedBuilder } from './base-builder';
import { GetOptions, InsertOptions } from './interfaces';

export class SkillSeedBuilder2 extends BaseSeedBuilder<SkillModel> {
  constructor(dbConnection: Kysely<IDatabaseModels> | Transaction<IDatabaseModels>) {
    super(dbConnection, TableNames.SKILLS);
  }

  async insertWithDependencies(
    otherBuildersWithOptions: { builder: BaseSeedBuilder<any>; options?: GetOptions }[],
    insertOptions?: InsertOptions,
  ): Promise<void> {
    let values: SkillModel[] = [];
    const quantity = insertOptions?.quantity ?? 1;

    for (let i = 0; i < quantity; i++) {
      values.push(SkillFixtureFactory.createRandom());
    }

    for await (const { builder, options } of otherBuildersWithOptions) {
      if (builder?.getTableName() === TableNames.CATEGORIES) {
        const categories = (await builder.getMany(quantity, { ...options, shuffle: true, fields: ['id'] })) as CategoryModel[];

        values = values.map((value, i) => ({
          ...value,
          categoryId: categories[i].id,
        }));
      }
    }

    this.daos = await this.insertDaos(values);
  }
}
