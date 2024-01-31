import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { TestingE2EFunctions } from '@app/database/kysley';
import { Kysely } from 'kysely';
import request from 'supertest';
import { AppModule } from '../app.module';
import { dialect, kyselyPlugins } from '../database';

type IDdbDaos = any;

describe('Template (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;

	const tablesInvolved = [];

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
			// Perform any other setup here
			// like insertion user, etc
			// all in a transaction
		});
	});

	let someDao: any;

	it('/user', async () => {
		// Act
		const response = await request(app.getHttpServer()).get('/user').set(['Authorization', `Bearer ZYX`]).set('Content-Type', 'application/json');

		// Assert
		expect(response.statusCode).toBe(401);
		expect(response.body.data.error).toEqual('Unauthorized');
	});
});
