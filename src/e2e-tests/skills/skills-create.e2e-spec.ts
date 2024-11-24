import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { CategorySeedBuilder2 } from '../builders/category-builder2';
import { SkillSeedBuilder2 } from '../builders/skill-builder2';

type IDdbDaos = IDatabaseModels;

describe('SkillsControllerV1 -> create (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  let credentials: [string, string];
  let categoryBuilder: CategorySeedBuilder2;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables([TableNames.CATEGORIES], trx);

      categoryBuilder = new CategorySeedBuilder2(trx);
      await categoryBuilder.insert({ quantity: 25 });
    });
  });

  afterAll(async () => {
    await dbConnection.destroy();
    await app.close();
  });

  let dataAssertion: { parentId?: number; name?: string; categoryId?: number };

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables([TableNames.SKILLS], trx);
      await loginUser(trx);
    });
  });

  describe('/skills (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create skill and return id', async () => {
        // Arrange

        const newName = 'test skill2';

        const categoryId = categoryBuilder.getDaos({ limit: 1, random: true })[0].id;

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: newName,
            description: 'default-skill2',
            categoryId,
          });

        const inserted = (await dbConnection
          .selectFrom(TableNames.SKILLS)
          .selectAll()
          .where('name', '=', newName)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(201);
        expect(inserted.categoryId).toBe(categoryId);
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 if skill with provided name and categoryId exists', async () => {
        // Arrange
        const builder = new SkillSeedBuilder2(dbConnection);

        await builder.insertWithDependencies([{ builder: categoryBuilder, options: { stretchRandom: true } }], { quantity: 1 });

        const { name, categoryId } = builder.getDaos({ limit: 1, random: true })[0];

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-skill',
            categoryId,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toEqual({
          error: expect.stringContaining(`${categoryId}`),
        });
      });

      it('should throw error if incorrect categoryId', async () => {
        // Arrange
        const last = categoryBuilder.getDaos({ last: true, limit: 1 })[0].id;

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: 'new-name',
            description: 'default-skill',
            categoryId: last + 1,
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
