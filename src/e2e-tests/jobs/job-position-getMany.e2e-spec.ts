import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { generateSlug } from '@libs/common';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/category-builder';
import { JobSeedBuilder } from '../builders/job-builder';
import { JobPositionFixtureFactory } from '../fixtures/job.fixture';

type IDdbDaos = IDatabaseModels;

describe('JobsControllerV1 -> getMany (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.CATEGORIES, TableNames.JOB_POSITIONS];

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
  let categoryBuilder: CategorySeedBuilder;
  let categoryBuilder2: CategorySeedBuilder;

  const testedTitle = 'Second JP';
  let testedCategoryId;

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);

      categoryBuilder = await CategorySeedBuilder.create(trx);
      categoryBuilder.withCategory({
        name: 'IT',
        description: 'IT category',
      });
      await categoryBuilder.build();

      categoryBuilder2 = await CategorySeedBuilder.create(trx);
      categoryBuilder2.withCategory({
        name: 'HR',
        description: 'HR category',
      });
      await categoryBuilder2.build();
      testedCategoryId = categoryBuilder2.categoryDao.id;

      const jobPositionBuilder = await JobSeedBuilder.create(trx);
      const entity = JobPositionFixtureFactory.create({ categoryId: categoryBuilder.categoryDao.id, skillIds: [] });

      jobPositionBuilder.withJobPosition(entity);
      await jobPositionBuilder.build();

      const jobPositionBuilder2 = await JobSeedBuilder.create(trx);
      const entity2 = JobPositionFixtureFactory.create({ categoryId: testedCategoryId, skillIds: [], title: testedTitle });

      jobPositionBuilder2.withJobPosition(entity2);
      await jobPositionBuilder2.build();

      const jobPositionBuilder3 = await JobSeedBuilder.create(trx);
      const entity3 = JobPositionFixtureFactory.create({ categoryId: testedCategoryId, skillIds: [], title: 'Recruter' });

      jobPositionBuilder3.withJobPosition(entity3);
      await jobPositionBuilder3.build();
    });
  });

  describe('/jos-positions (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should return all job-positions', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .get('/job-positions')
          .set(...credentials)
          .set('Content-Type', 'application/json');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(3);
      });

      it('should return filtered job-positions', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .get(`/job-positions?_filter[title]=${testedTitle}&_filter[categoryId]=${testedCategoryId}`)
          .set(...credentials)
          .set('Content-Type', 'application/json');

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toMatchSnapshot([
          {
            id: expect.any(String),
            title: testedTitle,
            slug: generateSlug(testedTitle),
            categoryId: expect.any(Number),
            skillIds: [],
          },
        ]);
      });
    });
  });
});
