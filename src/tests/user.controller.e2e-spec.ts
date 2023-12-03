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

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
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
		const response = await request(app.getHttpServer()).get('/user');

		expect(response.statusCode).toBe(200);
		expect(response.text).toEqual('This action returns all userss');
	});
});
