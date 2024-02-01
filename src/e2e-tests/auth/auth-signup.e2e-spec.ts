import { TestingE2EFunctions } from '@app/database/kysley';
import { ApiResponseStatusJsendEnum } from '@libs/common/api';
import { AuthenticationServer, TestLoggerModule, testingDefaults } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { UserAlreadyExistsError } from '@app/contexts/auth/users/domain/users/errors/user-already-exists.error';
import { AppRoutes } from '@app/core';
import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { UserSeedBuilder } from '../builders/builder';

type IDdbDaos = any;

describe('AuthJwtControllerV1 -> signup (e2e)', () => {
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
		});
	});

	describe('/auth/signup (POST) V1', () => {
		describe('SUCCESS', () => {
			it('should return success and both tokens', async () => {
				// Act
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signup).set('Content-Type', 'application/json').send({
					email: testingDefaults.email,
					password: testingDefaults.userPassword,
				});

				// Assert
				expect(response.statusCode).toBe(201);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.SUCCESS);
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
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signup).set('Content-Type', 'application/json').send({
					email: null,
					password: 12,
				});

				// Assert
				expect(response.statusCode).toBe(400);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
					data: {
						subErrors: expect.any(Array),
						error: expect.any(String),
					},
				});
			});

			it('should return conflict error', async () => {
				// Arrange
				await dbConnection.transaction().execute(async (trx) => {
					await dbUtils.truncateTables(tablesInvolved, trx);

					const seedBuilder = await UserSeedBuilder.create(trx);
					seedBuilder.withUser().withAuthUser();
					await seedBuilder.build();
				});

				// Act
				const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signup).set('Content-Type', 'application/json').send({
					email: testingDefaults.email,
					password: testingDefaults.userPassword,
				});

				// Assert
				expect(response.statusCode).toBe(409);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
					data: {
						error: UserAlreadyExistsError.withEmail(testingDefaults.email).message,
					},
				});
			});
		});
	});
});
