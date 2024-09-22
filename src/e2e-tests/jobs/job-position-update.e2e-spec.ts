import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { generateSlug } from '@libs/common';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { JobSeedBuilder } from '../builders/job-builder';
import { SkillSeedBuilder } from '../builders/skill-builder';
import { JobPositionFixtureFactory } from '../fixtures/job.fixture';

type IDdbDaos = IDatabaseModels;

describe('JobsControllerV1 -> update (e2e)', () => {
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
  let jobPositionBuilder: JobSeedBuilder;
  let jobPositionBuilder2: JobSeedBuilder;

  const oldTitle = 'Old title';
  const oldTitle2 = 'Old title 2';

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

      const entity = JobPositionFixtureFactory.create({
        title: oldTitle,
        skillIds: [skillBuilder.skillDao.id],
        categoryId: skillBuilder.categoryDao.id,
      });

      jobPositionBuilder = await JobSeedBuilder.create(trx);
      jobPositionBuilder.withJobPosition(entity);
      await jobPositionBuilder.build();

      const entity2 = JobPositionFixtureFactory.create({
        title: oldTitle2,
        skillIds: [skillBuilder.skillDao.id],
        categoryId: skillBuilder.categoryDao.id,
      });

      jobPositionBuilder2 = await JobSeedBuilder.create(trx);
      jobPositionBuilder2.withJobPosition(entity2);
      await jobPositionBuilder2.build();
    });
  });

  describe('/jos-positions/:id (PATCH) V1', () => {
    describe('SUCCESS', () => {
      it('should update job', async () => {
        // Arrange
        const newTitle = 'New Title';
        const newSlug = generateSlug(newTitle);

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/job-positions/${jobPositionBuilder.jobPositionDao.id}`)
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            title: newTitle,
            skillIds: [skillBuilder.skillDao.id, skillBuilder2.skillDao.id],
          });

        const inserted = await dbConnection
          .selectFrom(TableNames.JOB_POSITIONS)
          .selectAll()
          .where('id', '=', jobPositionBuilder.jobPositionDao.id)
          .executeTakeFirst();

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toEqual({
          id: inserted?.id,
        });
        expect(inserted?.skillIds.length).toBe(2);
        expect(inserted).toMatchSnapshot({
          title: newTitle,
          slug: newSlug,
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
        const response = await request(app.getHttpServer())
          .patch(`/job-positions/${jobPositionBuilder2.jobPositionDao.id}`)
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            title: oldTitle,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toMatchSnapshot({
          error: expect.stringContaining('Entity with title'),
        });
      });
    });
  });
});
