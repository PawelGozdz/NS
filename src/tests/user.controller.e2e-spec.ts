import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthUserDao, UserDao } from '@app/contexts/auth';
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

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, TestLoggerModule.forRoot()],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		authenticationServer = new AuthenticationServer();
	});

	afterAll(async () => {
		await dbConnection.destroy();
		await app.close();
	});

	beforeEach(async () => {
		await dbConnection.transaction().execute(async (trx) => {
			await dbUtils.truncateTables(tablesInvolved, trx);

			const builder = await UserSeedBuilder.create(trx);
			await builder.insertUser();
			await builder.insertAuthUser();

			userDao = builder.userDao;
			authUserDao = builder.authUserDao;
		});
	});

	let userDao: UserDao;
	let authUserDao: AuthUserDao;

	it('/user', async () => {
		const response = await request(app.getHttpServer())
			.get('/user')
			.set(...authenticationServer.getTokensAsCookie())
			.set('Content-Type', 'application/json');

		expect(response.statusCode).toBe(200);
		expect(response.body.data).toEqual('This action returns all userss');
	});
});
