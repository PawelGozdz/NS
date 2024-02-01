import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { HashService } from '@app/contexts/auth';
import { IDatabaseDaos, TestingE2EFunctions } from '@app/database/kysley';
import { Kysely } from 'kysely';
import request from 'supertest';
import { AppModule } from '../app.module';
import { TableNames, dialect, kyselyPlugins } from '../database';
import { UserSeedBuilder } from './builders/builder';

type IDdbDaos = IDatabaseDaos;

describe('UserController (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;
	let hashService: HashService;

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, TestLoggerModule.forRoot()],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		authenticationServer = new AuthenticationServer();
		hashService = app.get(HashService);
	});

	afterAll(async () => {
		await dbConnection.destroy();
		await app.close();
	});

	let cookieTokens: [string, string];
	let cookies: [string, string];

	beforeEach(async () => {
		cookieTokens = [authenticationServer.generateAccessToken(), authenticationServer.generateRefreshToken()];
		cookies = authenticationServer.getTokensAsCookie({
			accessToken: cookieTokens[0],
			refreshToken: cookieTokens[1],
		});

		await dbConnection.transaction().execute(async (trx) => {
			await dbUtils.truncateTables(tablesInvolved, trx);

			const seedBuilder = await UserSeedBuilder.create(trx);
			seedBuilder.withUser().withAuthUser({
				hashedRt: await hashService.hashData(cookieTokens[1]),
			});
			await seedBuilder.build();
		});
	});

	it('/user', async () => {
		const response = await request(app.getHttpServer())
			.get('/user')
			.set(...cookies)
			.set('Content-Type', 'application/json');

		expect(response.statusCode).toBe(200);
		expect(response.body.data).toEqual('This action returns all userss');
	});
});
