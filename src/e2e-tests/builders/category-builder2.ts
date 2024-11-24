/* eslint-disable no-plusplus */
import { Kysely, Transaction } from 'kysely';

import { CategoryModel } from '@app/contexts';
import { IDatabaseModels, TableNames } from '@app/core';

import { CategoryFixtureFactory } from '../fixtures';
import { BaseSeedBuilder } from './base-builder';
import { InsertOptions } from './interfaces';

export class CategorySeedBuilder2 extends BaseSeedBuilder<CategoryModel> {
  constructor(dbConnection: Kysely<IDatabaseModels> | Transaction<IDatabaseModels>) {
    super(dbConnection, TableNames.CATEGORIES);
  }

  async insert(options: InsertOptions): Promise<void> {
    const quantity = options.quantity ?? 1;

    const values: CategoryModel[] = [];
    for (let i = 0; i < quantity; i++) {
      values.push(CategoryFixtureFactory.createRandom());
    }

    this.daos = await this.insertDaos(values);
  }
}
