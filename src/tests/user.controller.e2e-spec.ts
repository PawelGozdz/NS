import { AuthenticationServer } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import knex, { Knex } from 'knex';
import { clean } from 'knex-cleaner';
import request from 'supertest';
import { AppModule } from '../app.module';
import config from '../database/knexfile';

describe('UserController (e2e)', () => {
	const dbConnection: Knex = knex(config);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;
	let accessToken: string;

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
		await clean(dbConnection, {
			mode: 'truncate',
			ignoreTables: ['knex_migrations', 'knex_migrations_lock'],
		});
	});

	it('/user (GET)', async () => {
		const response = await request(app.getHttpServer())
			.get('/user')
			.set(...authenticationServer.getTokensAsCookie())
			.set('Content-Type', 'application/json');

		expect(response.statusCode).toBe(200);
		expect(response.text).toEqual('This action returns all userss');
	});
});
