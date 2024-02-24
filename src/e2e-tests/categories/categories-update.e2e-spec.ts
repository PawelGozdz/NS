import { TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/csategory-builder';

type IDdbDaos = any;

describe('CategoriesControllerV1 -> update (e2e)', () => {
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
	let builder: CategorySeedBuilder;
	let categoryInsertedId: number;

	const ctx = 'users';
	const name = 'test category';

	beforeEach(async () => {
		cookies = getCookies();

		await dbConnection.transaction().execute(async (trx) => {
			await dbUtils.truncateTables(tablesInvolved, trx);
			await loginUser(trx);

			builder = await CategorySeedBuilder.create(trx);
			builder.withCategory({
				name,
				description: 'default-category',
				ctx,
			});
			await builder.build();
			categoryInsertedId = builder.categoryDao.id;
		});
	});

	describe('/categories (PATCH) V1', () => {
		describe('SUCCESS', () => {
			it('should update category without parentId', async () => {
				// Arrange
				const newName = 'new-name';

				// Act
				const response = await request(app.getHttpServer())
					.patch(`/categories/${categoryInsertedId}`)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send({
						name: newName,
						description: 'default-category',
						ctx,
					});

				const updatedCategory = await dbConnection
					.selectFrom(TableNames.CATEGORIES)
					.selectAll()
					.where('id', '=', categoryInsertedId)
					.executeTakeFirst();

				// Assert
				expect(response.statusCode).toBe(200);
				expect(updatedCategory!.name).toBe(newName);
			});

			it('should update category without parentId', async () => {
				// Arrange
				const name2 = 'test category 2';
				const seedBuilder2 = await CategorySeedBuilder.create(dbConnection);
				seedBuilder2.withCategory({
					name: name2,
					description: 'default-category',
					ctx,
				});
				await seedBuilder2.build();
				const categoryInsertedId2 = seedBuilder2.categoryDao.id;

				const newName = 'new-name';

				// Act
				const response = await request(app.getHttpServer())
					.patch(`/categories/${categoryInsertedId2}`)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send({
						name: newName,
						description: 'default-category',
						ctx,
						parentId: categoryInsertedId,
					});

				const updatedCategory = await dbConnection
					.selectFrom(TableNames.CATEGORIES)
					.selectAll()
					.where('id', '=', categoryInsertedId2)
					.executeTakeFirst();

				// Assert
				expect(response.statusCode).toBe(200);
				expect(updatedCategory!.parentId).toBe(categoryInsertedId);
			});
		});

		describe('FAILURE', () => {
			it('should throw 409 if category with provided name and ctx exists', async () => {
				// Arrange
				const name = 'test category';
				const name2 = 'test category2';
				const ctx = 'users';
				const seedBuilder = await CategorySeedBuilder.create(dbConnection);
				seedBuilder.withCategory({
					name: name2,
					description: 'default-category',
					ctx,
				});
				await seedBuilder.build();
				const categoryInsertedId2 = seedBuilder.categoryDao.id;

				// Act
				const response = await request(app.getHttpServer())
					.patch(`/categories/${categoryInsertedId2}`)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send({
						name,
						description: 'default-category',
						ctx,
					});

				// Assert
				expect(response.statusCode).toBe(409);
			});

			it('should throw error if incorrect parentId', async () => {
				// Arrange
				const name = 'test category2';
				const ctx = 'users';

				const seedBuilder = await CategorySeedBuilder.create(dbConnection);
				seedBuilder.withCategory({
					name,
					description: 'default-category',
					ctx,
				});
				await seedBuilder.build();
				const categoryInsertedId2 = seedBuilder.categoryDao.id;

				// Act
				const response = await request(app.getHttpServer())
					.patch(`/categories/${categoryInsertedId2}`)
					.set(...cookies)
					.set('Content-Type', 'application/json')
					.send({
						name,
						description: 'default-category',
						ctx,
						parentId: categoryInsertedId + 5,
					});

				// Assert
				expect(response.statusCode).toBe(409);
				expect(response.body).toMatchObject({
					status: 'fail',
					data: {
						error: expect.any(String),
					},
				});
			});
		});
	});
});
