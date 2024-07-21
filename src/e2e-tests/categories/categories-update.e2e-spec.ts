import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/csategory-builder';

describe('CategoriesControllerV1 -> update (e2e)', () => {
  const dbConnection = new Kysely<IDatabaseModels>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.CATEGORIES];

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

  let credentials: [string, string];
  let builder: CategorySeedBuilder;
  let categoryInsertedId: number;
  let dataAssertion: { parentId?: number; name?: string };

  const context = 'users';
  const name = 'test category';

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);

      builder = await CategorySeedBuilder.create(trx);
      builder.withCategory({
        name,
        description: 'default-category',
        context,
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
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: newName,
            description: 'default-category',
            context,
          });

        const updatedCategory = (await dbConnection
          .selectFrom(TableNames.CATEGORIES)
          .selectAll()
          .where('id', '=', categoryInsertedId)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(200);
        expect(updatedCategory.name).toBe(newName);
      });

      it('should update category without parentId', async () => {
        // Arrange
        const name2 = 'test category 2';
        const seedBuilder2 = await CategorySeedBuilder.create(dbConnection);
        seedBuilder2.withCategory({
          name: name2,
          description: 'default-category',
          context,
        });
        await seedBuilder2.build();
        const categoryInsertedId2 = seedBuilder2.categoryDao.id;

        const newName = 'new-name';

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/categories/${categoryInsertedId2}`)
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: newName,
            description: 'default-category',
            context,
            parentId: categoryInsertedId,
          });

        const updatedCategory = (await dbConnection
          .selectFrom(TableNames.CATEGORIES)
          .selectAll()
          .where('id', '=', categoryInsertedId2)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(200);
        expect(updatedCategory.parentId).toBe(categoryInsertedId);
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 if category with provided name and context exists', async () => {
        // Arrange
        const name2 = 'test category2';
        const seedBuilder = await CategorySeedBuilder.create(dbConnection);
        seedBuilder.withCategory({
          name: name2,
          description: 'default-category',
          context,
        });
        await seedBuilder.build();
        const categoryInsertedId2 = seedBuilder.categoryDao.id;

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/categories/${categoryInsertedId2}`)
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-category',
            context,
          });

        // Assert
        expect(response.statusCode).toBe(409);
      });

      it('should throw error if incorrect parentId', async () => {
        // Arrange

        const seedBuilder = await CategorySeedBuilder.create(dbConnection);
        seedBuilder.withCategory({
          name: 'new-name-55',
          description: 'default-category',
          context,
        });
        await seedBuilder.build();
        const categoryInsertedId2 = seedBuilder.categoryDao.id;

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/categories/${categoryInsertedId2}`)
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
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
