import { AuthenticationServer } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthUserDao, UserDao } from '@app/contexts/auth';
import { IDatabaseDaos, TestingE2EFunctions } from '@app/database/kysley';
import { Kysely } from 'kysely';
import request from 'supertest';
import { AppModule } from '../app.module';
import { TableNames, dialect, kyselyPlugins } from '../database';
import { AuthUserFixtureFactory, UserFixtureFactory } from './fixtures';

describe('UserController (e2e)', () => {
	const dbConnection = new Kysely<IDatabaseDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
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
		await dbUtils.truncateTables(tablesInvolved);

		const userDaoObj = UserFixtureFactory.create({
			id: authenticationServer.getTestingUserId(),
		});
		await dbConnection.insertInto(TableNames.USERS).values(userDaoObj).execute();
		userDao = (await dbConnection.selectFrom(TableNames.USERS).selectAll().where('id', '=', userDaoObj.id).executeTakeFirst()) as UserDao;

		const authUserDaoObj = AuthUserFixtureFactory.create({
			userId: userDaoObj!.id,
			email: userDaoObj!.email,
		});

		await dbConnection.insertInto(TableNames.AUTH_USERS).values(authUserDaoObj).execute();
		authUserDao = (await dbConnection
			.selectFrom(TableNames.AUTH_USERS)
			.selectAll()
			.where('userId', '=', userDaoObj.id)
			.executeTakeFirst()) as AuthUserDao;
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
