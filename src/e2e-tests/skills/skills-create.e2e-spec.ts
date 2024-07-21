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

  const tablesInvolved = [TableNames.SKILLS];

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
  let dataAssertion: { parentId?: number; name?: string };

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);
      await loginUser(trx);
    });
  });

  const context = 'users';
  const name = 'test skill';

  describe('/skills (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create skill without parent and return id', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-skill',
            context,
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

      it('should create skill with parent and return id', async () => {
        // Arrange
        const seedBuilder = await SkillSeedBuilder.create(dbConnection);
        seedBuilder.withSkill({
          name,
          description: 'default-skill',
          context,
        });
        await seedBuilder.build();
        const skillInsertedId = seedBuilder.skillDao.id;

        const newName = 'test skill2';
        const newcontext = 'users';

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: newName,
            description: 'default-skill2',
            context: newcontext,
            parentId: skillInsertedId,
          });

        const inserted = (await dbConnection
          .selectFrom(TableNames.SKILLS)
          .selectAll()
          .where('name', '=', newName)
          .where('context', '=', newcontext)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(201);
        expect(inserted.parentId).toBe(skillInsertedId);
      });
    });

    describe('FAILURE', () => {
      it('should throw 409 if skill with provided name and context exists', async () => {
        // Arrange
        const seedBuilder = await SkillSeedBuilder.create(dbConnection);
        seedBuilder.withSkill({
          name,
          description: 'default-skill',
          context,
        });

        await seedBuilder.build();

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name,
            description: 'default-skill',
            context,
          });

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body.data).toEqual({
          error: expect.any(String),
        });
      });

      it('should throw error if incorrect parentId', async () => {
        // Arrange

        const seedBuilder = await SkillSeedBuilder.create(dbConnection);
        seedBuilder.withSkill({
          name,
          description: 'default-skill',
          context,
        });
        await seedBuilder.build();
        const insertedId = seedBuilder.skillDao.id + 1;

        // Act
        const response = await request(app.getHttpServer())
          .post('/skills')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send({
            name: 'new-name',
            description: 'default-skill',
            context,
            parentId: insertedId,
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
