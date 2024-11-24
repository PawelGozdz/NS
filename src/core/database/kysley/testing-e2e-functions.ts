/* eslint-disable no-restricted-syntax */
import { Kysely, Transaction, sql } from 'kysely';

import { IDatabaseModels } from '@app/core';

import { TableNames } from '../table-names';

type IDatabaseDaos = IDatabaseModels;
export class TestingE2EFunctions {
  constructor(private readonly connection: Kysely<IDatabaseDaos>) {}

  async truncateTables(givenTables?: string[], trx?: Kysely<IDatabaseDaos> | Transaction<IDatabaseDaos>) {
    const tables = Array.isArray(givenTables) ? givenTables : Object.values(TableNames);

    for await (const tableName of tables) {
      await sql.raw(`TRUNCATE TABLE ${this.convertCamelToSnakeCase(tableName)} CASCADE`).execute(trx ?? this.connection);
    }
  }

  convertCamelToSnakeCase(str: string) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
