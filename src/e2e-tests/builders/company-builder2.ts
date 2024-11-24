/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Kysely, Transaction } from 'kysely';

import { CompanyModel } from '@app/contexts';
import { IDatabaseModels, TableNames } from '@app/core';

import { CompanyFixtureFactory } from '../fixtures';
import { BaseSeedBuilder } from './base-builder';
import { InsertOptions } from './interfaces';

export class CompanySeedBuilder2 extends BaseSeedBuilder<CompanyModel> {
  constructor(dbConnection: Kysely<IDatabaseModels> | Transaction<IDatabaseModels>) {
    super(dbConnection, TableNames.COMPANIES);
  }

  async insert(options: InsertOptions): Promise<void> {
    const quantity = options.quantity ?? 1;

    const values: CompanyModel[] = [];
    for (let i = 0; i < quantity; i++) {
      values.push(CompanyFixtureFactory.createRandom());
    }

    this.daos = await this.insertDaos(values);
  }
}
