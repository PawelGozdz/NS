import { Kysely, Transaction } from 'kysely';

import { TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { IDatabaseModels } from '@libs/common';
import { AuthenticationServer } from '@libs/testing';

import { UserSeedBuilder } from './user-builder';

const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

const authenticationServer = new AuthenticationServer();

type IDatabaseDaos = IDatabaseModels;

const dbConnection = new Kysely<IDatabaseDaos>({
  dialect,
  plugins: kyselyPlugins,
});
const dbUtils = new TestingE2EFunctions(dbConnection);

export const getAccessToken = () => authenticationServer.generateAccessToken();
export const getRefreshToken = () => authenticationServer.generateRefreshToken();

export const getCookies = () =>
  authenticationServer.getTokensAsCookie({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
  });

export async function loginUser(transaction?: Transaction<IDatabaseDaos>) {
  if (transaction) {
    return seed(transaction);
  }
  return dbConnection.transaction().execute(async (trx) => seed(trx));
}

async function seed(trx: Transaction<IDatabaseDaos>) {
  await dbUtils.truncateTables(tablesInvolved, trx);

  const seedBuilder = await UserSeedBuilder.create(trx);
  seedBuilder.withUser().withAuthUser().withProfile();
  await seedBuilder.build();
  return seedBuilder;
}
