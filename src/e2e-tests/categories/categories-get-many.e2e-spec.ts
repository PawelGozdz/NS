import { TestingE2EFunctions } from '@app/database/kysley';
import { TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/csategory-builder';

type IDdbDaos = any;

describe('CategoriesControllerV1 -> getMany (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;

	const tablesInvolved = [TableNames.CATEGORIES];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, TestLoggerModule.forRoot()],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterAll(async () => {
		await dbConnection.destroy();
		await app.close();
	});

	let cookies: [string, string];
	let parentId: number;

	beforeEach(async () => {
		cookies = getCookies();

		await dbConnection.transaction().execute(async (trx) => {
			await dbUtils.truncateTables(tablesInvolved, trx);
			await loginUser(trx);

			const seedBuilder = await CategorySeedBuilder.create(trx);
			seedBuilder.withCategory({
				name,
				description: 'default-category',
				ctx,
			});
			await seedBuilder.build();

			parentId = seedBuilder.categoryDao.id;

			seedBuilder.withCategory({
				name: 'new-name',
				ctx,
				parentId,
			});
			await seedBuilder.build();
		});
	});

	const ctx = 'users';
	const name = 'test category';

	describe('/categories (GET) V1', () => {
		describe('SUCCESS', () => {
			it('should return array of categories', async () => {
				// Arrange

				// Act
				const response = await request(app.getHttpServer())
					.get(`/categories`)
					.set(...cookies)
					.set('Content-Type', 'application/json');

				// Assert
				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBe(2);
			});

			it('should return array of categories filtered by parentId', async () => {
				// Arrange

				// Act
				const response = await request(app.getHttpServer())
					.get(`/categories?_filter[parentId]=${parentId}`)
					.set(...cookies)
					.set('Content-Type', 'application/json');

				// Assert
				expect(response.statusCode).toBe(200);
				expect(response.body.data.length).toBe(1);
				expect(response.body.data[0].parentId).toBe(parentId);
			});
		});
	});
});
