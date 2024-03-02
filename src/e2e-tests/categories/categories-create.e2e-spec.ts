import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { IDatabaseModels } from '@libs/common';
import { TestLoggerModule } from '@libs/testing';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/csategory-builder';

type IDdbDaos = IDatabaseModels;

describe('CategoriesControllerV1 -> create (e2e)', () => {
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
  let dataAssertion: { parentId?: number; name?: string };

  beforeEach(async () => {
    cookies = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);
    });
  });

  const ctx = 'users';
  const name = 'test category';

  describe('/categories (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create category without parent and return id', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .post('/categories')
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-category',
            ctx,
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

      it('should create category with parent and return id', async () => {
        // Arrange
        const seedBuilder = await CategorySeedBuilder.create(dbConnection);
        seedBuilder.withCategory({
          name,
          description: 'default-category',
          ctx,
        });
        await seedBuilder.build();
        const categoryInsertedId = seedBuilder.categoryDao.id;

        const newCategoryName = 'test category2';
        const newCtx = 'users';

        // Act
        const response = await request(app.getHttpServer())
          .post('/categories')
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send({
            name: newCategoryName,
            description: 'default-category2',
            ctx: newCtx,
            parentId: categoryInsertedId,
          });

        const insertedCategory = (await dbConnection
          .selectFrom(TableNames.CATEGORIES)
          .selectAll()
          .where('name', '=', newCategoryName)
          .where('ctx', '=', newCtx)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(201);
        expect(insertedCategory.parentId).toBe(categoryInsertedId);
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 if category with provided name and ctx exists', async () => {
        // Arrange
        const seedBuilder = await CategorySeedBuilder.create(dbConnection);
        seedBuilder.withCategory({
          name,
          description: 'default-category',
          ctx,
        });

        await seedBuilder.build();

        // Act
        const response = await request(app.getHttpServer())
          .post('/categories')
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-category',
            ctx,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toEqual({
          error: expect.any(String),
        });
      });

      it('should throw error if incorrect parentId', async () => {
        // Arrange

        const seedBuilder = await CategorySeedBuilder.create(dbConnection);
        seedBuilder.withCategory({
          name,
          description: 'default-category',
          ctx,
        });
        await seedBuilder.build();
        const categoryInsertedId = seedBuilder.categoryDao.id + 1;

        // Act
        const response = await request(app.getHttpServer())
          .post('/categories')
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send({
            name: 'new-name',
            description: 'default-category',
            ctx,
            parentId: categoryInsertedId,
          });

        // Assert
        expect(response.statusCode).toBe(400);
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
