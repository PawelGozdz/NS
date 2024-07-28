import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { SkillSeedBuilder } from '../builders/skill-builder';

type IDdbDaos = IDatabaseModels;

describe('SkillsControllerV1 -> create (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.SKILLS, TableNames.CATEGORIES];

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
  let builder: SkillSeedBuilder;
  let dataAssertion: { parentId?: number; name?: string; categoryId?: number };

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);

      builder = await SkillSeedBuilder.create(trx);
      builder.withCategory().withSkill();
      await builder.build();

      await loginUser(trx);
    });
  });

  describe('/skills (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create skill and return id', async () => {
        // Arrange

        const newName = 'test skill2';

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: newName,
            description: 'default-skill2',
            categoryId: builder.categoryDao.id,
          });

        const inserted = (await dbConnection
          .selectFrom(TableNames.SKILLS)
          .selectAll()
          .where('name', '=', newName)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(201);
        expect(inserted.categoryId).toBe(builder.categoryDao.id);
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 if skill with provided name and categoryId exists', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: builder.skillDao.name,
            description: 'default-skill',
            categoryId: builder.categoryDao.id,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toEqual({
          error: expect.stringContaining(`${builder.categoryDao.id}`),
        });
      });

      it('should throw error if incorrect categoryId', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: 'new-name',
            description: 'default-skill',
            categoryId: builder.categoryDao.id + 1,
          });

        // Assert
        expect(response.statusCode).toBe(404);
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
