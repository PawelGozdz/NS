import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder } from '../builders/category-builder';
import { JobSeedBuilder } from '../builders/job-builder';
import { SkillSeedBuilder } from '../builders/skill-builder';
import { JobPositionFixtureFactory } from '../fixtures/job.fixture';

type IDdbDaos = IDatabaseModels;

describe('JobsControllerV1 -> create (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.CATEGORIES, TableNames.SKILLS, TableNames.JOB_POSITIONS, TableNames.JOBS];

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
  let skillBuilder2: SkillSeedBuilder;

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

      skillBuilder2 = await SkillSeedBuilder.create(trx);
      skillBuilder2
        .withCategory({
          name: 'IT',
          description: 'IT category',
        })
        .withSkill({
          name: 'HR',
          description: 'Researcher',
        });
      await skillBuilder2.build();
    });
  });

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
            skillIds: [skillBuilder.skillDao.id, skillBuilder2.skillDao.id],
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
        expect(inserted).toMatchSnapshot({
          title: entity.title,
          slug: entity.slug,
          categoryId: expect.any(Number),
          skillIds: expect.any(Array),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: expect.any(String),
        });
      });

      it('should create job with existing title but different categoryId', async () => {
        // Arrange
        const entity = JobPositionFixtureFactory.create({
          title: 'Backend Developer',
        });

        const categoryBuilder = await CategorySeedBuilder.create(dbConnection);
        categoryBuilder.withCategory({
          name: 'IT',
          description: 'IT category',
        });
        await categoryBuilder.build();

        const jobPositionBuilder = await JobSeedBuilder.create(dbConnection);
        jobPositionBuilder.withJobPosition({
          ...entity,
          categoryId: categoryBuilder.categoryDao.id,
        });
        await jobPositionBuilder.build();

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
        expect(inserted).toMatchSnapshot({
          title: entity.title,
          slug: entity.slug,
          categoryId: expect.any(Number),
          skillIds: expect.any(Array),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          id: expect.any(String),
        });
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 for combination title + categoryId', async () => {
        // Arrange
        const entity = JobPositionFixtureFactory.create({
          title: 'Backend Developer',
        });

        const categoryBuilder = await CategorySeedBuilder.create(dbConnection);
        categoryBuilder.withCategory({
          name: 'IT',
          description: 'IT category',
        });
        await categoryBuilder.build();

        const jobPositionBuilder = await JobSeedBuilder.create(dbConnection);
        jobPositionBuilder.withJobPosition({
          ...entity,
          categoryId: categoryBuilder.categoryDao.id,
        });
        await jobPositionBuilder.build();

        // Act
        const response = await request(app.getHttpServer())
          .post('/job-positions')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            ...entity,
            skillIds: [skillBuilder.skillDao.id],
            categoryId: categoryBuilder.categoryDao.id,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toMatchSnapshot({
          error: expect.stringContaining('Entity with title'),
        });
      });

      it('should return error if given skill id no exists', async () => {
        // Arrange
        const entity = JobPositionFixtureFactory.create();

        // Act
        const response = await request(app.getHttpServer())
          .post('/job-positions')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            ...entity,
            skillIds: [skillBuilder.skillDao.id, 1, 2, 3],
            categoryId: skillBuilder.categoryDao.id,
          });

        // Assert
        // expect(response.statusCode).toBe(400);
        expect(response.body.data).toMatchSnapshot();
      });
    });
  });
});
