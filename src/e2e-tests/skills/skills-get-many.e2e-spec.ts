import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppModule } from '@app/app.module';
import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/category-builder';

type IDdbDaos = IDatabaseModels;

describe('CategoriesControllerV1 -> getMany (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.CATEGORIES, TableNames.SKILLS];

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
  let parentId: number;

  beforeEach(async () => {
    const name = 'test category';

    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);

      const seedBuilder = await CategorySeedBuilder.create(trx);
      seedBuilder.withCategory({
        name,
        description: 'default-category',
      });
      await seedBuilder.build();

      parentId = seedBuilder.categoryDao.id;

      seedBuilder.withCategory({
        name: 'new-name',
        parentId,
      });
      await seedBuilder.build();
    });
  });

  describe('/categories (GET) V1', () => {
    describe('SUCCESS', () => {
      it('should return array of categories', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .get('/categories')
          .set(...credentials)
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
          .set(...credentials)
          .set('Content-Type', 'application/json');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.data[0].parentId).toBe(parentId);
      });
    });
  });
});
