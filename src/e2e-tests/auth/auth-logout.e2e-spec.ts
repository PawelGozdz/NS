import { HashService } from '@app/contexts/auth';
import { AppRoutes, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { UnauthorizedError } from '@libs/common';
import { ApiResponseStatusJsendEnum } from '@libs/common/api';
import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';

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

	let cookies: [string, string];

	beforeEach(async () => {
		cookies = getCookies();

		await dbConnection.transaction().execute(async (trx) => {
			await loginUser(trx);
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
