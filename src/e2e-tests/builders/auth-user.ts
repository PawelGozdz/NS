import { TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { AuthenticationServer } from '@libs/testing';
import { Kysely, Transaction } from 'kysely';

import { UserSeedBuilder } from './user-builder';

const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

const authenticationServer = new AuthenticationServer();

type IDdbDaos = any;
const dbConnection = new Kysely<IDdbDaos>({
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

export async function loginUser(trx?: Transaction<any>) {
	if (trx) {
		return seed(trx);
	}
	return dbConnection.transaction().execute(async (trx) => seed(trx));
}

async function seed(trx: Transaction<any>) {
	await dbUtils.truncateTables(tablesInvolved, trx);

	const seedBuilder = await UserSeedBuilder.create(trx);
	seedBuilder.withUser().withAuthUser().withProfile();
	await seedBuilder.build();
	return seedBuilder;
}
