import { TestingE2EFunctions } from '@app/database/kysley';
import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppRoutes } from '@app/core';
import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { UserSeedBuilder } from '../builders/builder';

type IDdbDaos = any;

describe('CategoriesControllerV1 -> create (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES, TableNames.CATEGORIES];

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
			seedBuilder.withUser().withAuthUser().withProfile();
			await seedBuilder.build();
		});
	});

	describe('/categories (POST) V1', () => {
		describe('SUCCESS', () => {
			it('should create category without parent and return id', async () => {
				// Arrange

				// Act
				const response = await request(app.getHttpServer())
					.post(`${AppRoutes.CATEGORIES.v1.create}`)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send({
						name: 'test category',
						description: 'default-category',
						ctx: 'users',
					});

				// Assert
				expect(response.statusCode).toBe(201);
				expect(response.body).toEqual({
					...response.body,
					data: {
						id: expect.any(Number),
					},
				});
			});

			// TODO
			// wstawić z parentem
			// ERROR: conflict
			// ERROR parent nie istnieje
			// ERROR parent jest taki sam jak categoryid

			// it('should return an empty list of users if not found any', async () => {
			// 	// Act
			// 	const response = await request(app.getHttpServer())
			// 		.get(`${AppRoutes.USERS.v1.getUsers}?_filter[email]=t@test.com`)
			// 		.set(...cookies)
			// 		.set('Content-Type', 'application/json')
			// 		.send();

			// 	// Assert
			// 	expect(response.statusCode).toBe(200);
			// 	expect(response.body.data.length).toBe(0);
			// });
		});
	});
});
