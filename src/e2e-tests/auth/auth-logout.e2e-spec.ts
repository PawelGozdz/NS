import { TestingE2EFunctions } from '@app/database/kysley';
import { ApiResponseStatusJsendEnum } from '@libs/common/api';
import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { HashService } from '@app/contexts/auth';
import { AppRoutes } from '@app/core';
import { UnauthorizedError } from '@libs/common';
import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { UserSeedBuilder } from '../builders/builder';

type IDdbDaos = any;

describe('AuthJwtControllerV1 -> logout (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;
	let hashService: HashService;

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, TestLoggerModule.forRoot()],
			providers: [HashService],
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
			seedBuilder.withUser().withAuthUser();
			await seedBuilder.build();
		});
	});

	describe('/auth/logout (POST) V1', () => {
		describe('SUCCESS', () => {
			it('should return both tokens if refresh token is still valid', async () => {
				// Act
				const response = await request(app.getHttpServer())
					.post(AppRoutes.AUTH.v1.logout)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send();

				// Assert
				expect(response.statusCode).toBe(204);
				expect(response.body).toMatchSnapshot();
			});
		});

		describe('FAILURE', () => {
			it('should return UnauthorizedError if incorrect refreshToken', async () => {
				// Act
				const response = await request(app.getHttpServer())
					.post(AppRoutes.AUTH.v1.logout)
					.set('Cookie', 'incorrect-cookie')
					.set('Content-Type', 'application/json')
					.send();

				// Assert
				expect(response.statusCode).toBe(401);
				expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
				expect(response.body).toMatchSnapshot({
					timestamp: expect.any(String),
					data: {
						error: UnauthorizedError.message,
					},
				});
			});
		});
	});
});
