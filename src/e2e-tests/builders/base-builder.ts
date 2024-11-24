/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/prefer-readonly */
/* eslint-disable @typescript-eslint/no-explicit-any */
// src/seed-builders/base-seed-builder.ts
import { Kysely, SelectExpression, sql, Transaction } from 'kysely';
import { InsertExpression } from 'kysely/dist/cjs/parser/insert-values-parser';
import { chunk, sampleSize, take } from 'lodash';

import { IDatabaseModels, TableNames } from '@app/core';

import { GetOptions } from './interfaces';

type GetDaosOptions = {
  limit?: number;
  random?: boolean;
} & ({ first?: true; last?: false } | { first?: false; last?: true } | { first?: false; last?: false });

export abstract class BaseSeedBuilder<T> {
  protected dbConnection: Kysely<IDatabaseModels> | Transaction<IDatabaseModels>;

  protected tableName: TableNames;

  protected daos: T[] = [];

  constructor(dbConnection: Kysely<IDatabaseModels> | Transaction<IDatabaseModels>, tableName: TableNames) {
    this.dbConnection = dbConnection;
    this.tableName = tableName;
  }

  getDaos(options?: GetDaosOptions): T[] {
    let result = this.daos;

    if (options?.random) {
      result = sampleSize(result, options.limit ?? result.length);
    } else if (options?.first) {
      result = take(result, options.limit ?? 1);
    } else if (options?.last) {
      result = take(result.reverse(), options.limit ?? 1);
    } else if (options?.limit) {
      result = take(result, options.limit);
    }

    return result;
  }

  public getTableName() {
    return this.tableName;
  }

  async getRandomIndex(options?: GetOptions): Promise<number | string> {
    const indexes = await this.selectFields({
      ...options,
      limit: 1,
      shuffle: true,
    });
    if (indexes.length === 0) {
      throw new Error(`No records found in table ${this.getTableName()}`);
    }
    return indexes[0].id;
  }

  async getFirst(options?: Pick<GetOptions, 'fields' | 'sort'>): Promise<T> {
    const sort = {
      sortColumn: options?.sort?.sortColumn ?? 'id',
      sortDirection: 'asc' as const,
    };

    const indexes = await this.selectFields({
      limit: 1,
      shuffle: false,
      sort,
    });
    if (indexes.length === 0) {
      throw new Error(`No records found in table ${this.getTableName()}`);
    }
    return indexes[0];
  }

  async getLast(options?: Pick<GetOptions, 'fields' | 'sort'>): Promise<T> {
    const sort = {
      sortColumn: options?.sort?.sortColumn ?? 'id',
      sortDirection: 'desc' as const,
    };

    const indexes = await this.selectFields({
      limit: 1,
      sort,
    });
    if (indexes.length === 0) {
      throw new Error(`No records found in table ${this.getTableName()}`);
    }

    return indexes[0];
  }

  async getMany(qty: number, options?: GetOptions): Promise<T[]> {
    const indexes = await this.selectFields({ ...options, limit: qty });

    if (indexes.length === 0) {
      throw new Error(`No records found in table ${this.getTableName()}`);
    }

    let result = indexes;

    if (options?.stretchRandom) {
      result = Array.from({ length: qty }, () => result[Math.floor(Math.random() * result.length)]);
    } else if (options?.stretch && result.length < qty) {
      result = Array.from({ length: qty }, (_, i) => result[i % result.length]);
    }

    return result;
  }

  async selectFields(options: GetOptions): Promise<any[]> {
    const fields = options?.fields ? options.fields : ['id'];

    let query = this.dbConnection.selectFrom(this.getTableName()).select(fields as unknown as SelectExpression<IDatabaseModels, TableNames>);

    if (options?.shuffle) {
      query = query.orderBy(sql`RANDOM()`);
    }

    if (options?.sort) {
      query = query.orderBy(options.sort.sortColumn, options.sort.sortDirection);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }
    return query.execute();
  }

  async insertDaos(values: T[]) {
    const models: T[] = [];

    for await (const chunks of chunk(values, 10000)) {
      models.push(...(await this.insertSmallChunk(chunks as InsertExpression<IDatabaseModels, TableNames>)));
    }

    return models;
  }

  private async insertSmallChunk(values: InsertExpression<IDatabaseModels, TableNames>) {
    return (await this.dbConnection.insertInto(this.getTableName()).values(values).returningAll().execute()) as T[];
  }
}
