import { TestingE2EFunctions } from '@app/database/kysley';
import { ApiResponseStatusJsendEnum } from '@libs/common/api';
import { AuthenticationServer, TestLoggerModule, testingDefaults } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AuthUserDao, UserDao } from '@app/contexts/auth';
import { AppRoutes } from '@app/core';
import { UnauthorizedError } from '@libs/common';
import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { AuthUserFixtureFactory, UserFixtureFactory } from '../fixtures';

type IDdbDaos = any;

describe('AuthJwtControllerV1 -> signin (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;

	const tablesInvolved = [TableNames.USERS, TableNames.USERS];

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

			const userDaoObj = UserFixtureFactory.create({
				id: authenticationServer.getTestingUserId(),
			});
			await trx.insertInto(TableNames.USERS).values(userDaoObj).execute();
			userDao = (await trx.selectFrom(TableNames.USERS).selectAll().where('id', '=', userDaoObj.id).executeTakeFirst()) as UserDao;

			const authUserDaoObj = AuthUserFixtureFactory.create({
				userId: userDaoObj!.id,
				email: userDaoObj!.email,
			});

			await trx.insertInto(TableNames.AUTH_USERS).values(authUserDaoObj).execute();
			authUserDao = (await trx.selectFrom(TableNames.AUTH_USERS).selectAll().where('userId', '=', userDaoObj.id).executeTakeFirst()) as AuthUserDao;
		});
	});

	let userDao: UserDao;
	let authUserDao: AuthUserDao;

	const defaultCorrectEmail = testingDefaults.email;
	const defaultcorrectPassword = testingDefaults.userPassword;

	describe('/auth/signin (POST) V1', () => {
		describe('SUCCESS', () => {
			it('should return success and both tokens', async () => {
				// Act
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
					email: defaultCorrectEmail,
					password: defaultcorrectPassword,
				});

				// Assert
				expect(response.statusCode).toBe(200);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.SUCCESS);
				expect(response.body.data).toEqual({
					access_token: expect.any(String),
					refresh_token: expect.any(String),
				});
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
					data: {
						access_token: expect.any(String),
						refresh_token: expect.any(String),
					},
				});
			});
		});

		describe('FAILURE', () => {
			it('should return input validation errors', async () => {
				// Act
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
					email: null,
					password: 12,
				});

				// Assert
				expect(response.statusCode).toBe(400);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
				expect(response.body.data).toEqual({
					subErrors: expect.any(Array),
					error: expect.any(String),
				});
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
					data: {
						subErrors: expect.any(Array),
						error: expect.any(String),
					},
				});
			});

			it('should return UnauthorizedError', async () => {
				// Act
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
					email: defaultCorrectEmail,
					password: 'incorrect-password',
				});

				// Assert
				expect(response.statusCode).toBe(401);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
				expect(response.body.data?.error).toEqual(UnauthorizedError.message);
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
				});
			});
		});
	});
});
