import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { SkillSeedBuilder } from '../builders/skill-builder';
import { JobPositionFixtureFactory } from '../fixtures/job.fixture';

type IDdbDaos = IDatabaseModels;

describe('JobssControllerV1 -> create (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.CATEGORIES, TableNames.SKILLS, TableNames.JOB_POSITIONS, TableNames.JOBS, TableNames.JOB_USER_PROFILES];

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
  let skillBuilder: SkillSeedBuilder;

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);

      skillBuilder = await SkillSeedBuilder.create(trx);
      skillBuilder
        .withCategory({
          name: 'IT',
          description: 'IT category',
        })
        .withSkill({
          name: 'Backend',
          description: 'Backend programming',
        });
      await skillBuilder.build();
    });
  });

  // const name = 'test category';

  describe('/jos-positions (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create job and return id', async () => {
        // Arrange
        const entity = JobPositionFixtureFactory.create();

        // Act
        const response = await request(app.getHttpServer())
          .post('/job-positions')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            ...entity,
            skillIds: [skillBuilder.skillDao.id],
            categoryId: skillBuilder.categoryDao.id,
          });

        const inserted = await dbConnection
          .selectFrom(TableNames.JOB_POSITIONS)
          .selectAll()
          .where('id', '=', response.body.data.id)
          .executeTakeFirst();

        // Assert
        expect(response.statusCode).toBe(201);
        expect(response.body.data).toEqual({
          id: inserted?.id,
        });
        expect(inserted).toMatchObject({
          title: entity.title,
          slug: entity.slug,
        });
      });

      // it('should create category with parent and return id', async () => {
      //   // Arrange
      //   const seedBuilder = await CategorySeedBuilder.create(dbConnection);
      //   seedBuilder.withCategory({
      //     name,
      //     description: 'default-category',
      //   });
      //   await seedBuilder.build();
      //   const categoryInsertedId = seedBuilder.categoryDao.id;

      //   const newCategoryName = 'test category2';

      //   // Act
      //   const response = await request(app.getHttpServer())
      //     .post('/categories')
      //     .set(...credentials)
      //     .set('Content-Type', 'application/json')
      //     .send({
      //       name: newCategoryName,
      //       description: 'default-category2',
      //       parentId: categoryInsertedId,
      //     });

      //   const insertedCategory = (await dbConnection
      //     .selectFrom(TableNames.CATEGORIES)
      //     .selectAll()
      //     .where('name', '=', newCategoryName)
      //     .executeTakeFirst()) as typeof dataAssertion;

      //   // Assert
      //   expect(response.statusCode).toBe(201);
      //   expect(insertedCategory.parentId).toBe(categoryInsertedId);
      // });
    });

    // describe('FAILURE', () => {
    //   it('should throw 409 if category with provided name (case-insensitive) and parentId exists', async () => {
    //     // Arrange
    //     const seedBuilder = await CategorySeedBuilder.create(dbConnection);
    //     seedBuilder.withCategory({
    //       name,
    //       description: 'default-category',
    //     });

    //     await seedBuilder.build();

    //     // Act
    //     const response = await request(app.getHttpServer())
    //       .post('/categories')
    //       .set(...credentials)
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         name: 'TEST CATEGORY',
    //         description: 'default-category',
    //         parentId: seedBuilder.categoryDao.id,
    //       });

    //     // Assert
    //     expect(response.statusCode).toBe(409);
    //     expect(response.body.data).toEqual({
    //       error: expect.any(String),
    //     });
    //   });

    //   it('should throw error if incorrect parentId', async () => {
    //     // Arrange

    //     const seedBuilder = await CategorySeedBuilder.create(dbConnection);
    //     seedBuilder.withCategory({
    //       name,
    //       description: 'default-category',
    //     });
    //     await seedBuilder.build();
    //     const categoryInsertedId = seedBuilder.categoryDao.id + 1;

    //     // Act
    //     const response = await request(app.getHttpServer())
    //       .post('/categories')
    //       .set(...credentials)
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         name: 'new-name',
    //         description: 'default-category',
    //         parentId: categoryInsertedId,
    //       });

    //     // Assert
    //     expect(response.statusCode).toBe(400);
    //     expect(response.body).toMatchObject({
    //       status: 'fail',
    //       data: {
    //         error: expect.any(String),
    //       },
    //     });
    //   });
    // });
  });
});
