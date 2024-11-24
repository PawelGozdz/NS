import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { CountryCode, IDatabaseModels, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';

type IDdbDaos = IDatabaseModels;

describe('CompaniesControllerV1 -> create (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

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

  beforeEach(async () => {
    credentials = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables([], trx);
      await loginUser(trx);
    });
  });

  describe('/companies (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should create a company and return id', async () => {
        // Arrange

        const body = {
          name: 'InPost',
          contactEmail: 'test@test.com',
          address: {
            city: 'Warsaw',
            street: 'Test',
            streetNumber: '1/59',
            postalCode: '00-000',
            countryCode: CountryCode.Poland,
          },
          phoneNumber: '510502081',
          countryCode: CountryCode.England,
        };

        // Act
        const response = await request(app.getHttpServer())
          .post('/companies')
          .set(...credentials)
          .set('Content-Type', 'application/json')
          .send(body);

        console.log('REdSP', response.body);

        // const inserted = await dbConnection.selectFrom(TableNames.COMPANIES).selectAll().where('name', '=', body.name).executeTakeFirst();

        // Assert
        expect(response.statusCode).toBe(201);
        expect(response.body.data.id).toBe(String);
      });
    });

    // describe('FAILURE', () => {
    //   it('should throw 409 if skill with provided name and categoryId exists', async () => {
    //     // Arrange
    //     const builder = new SkillSeedBuilder2(dbConnection);

    //     await builder.insertWithDependencies([{ builder: categoryBuilder, options: { stretchRandom: true } }], { quantity: 1 });

    //     const { name, categoryId } = builder.getDaos({ limit: 1, random: true })[0];

    //     // Act
    //     const response = await request(app.getHttpServer())
    //       .post('/skills')
    //       .set(...credentials)
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         name,
    //         description: 'default-skill',
    //         categoryId,
    //       });

    //     // Assert
    //     expect(response.statusCode).toBe(409);
    //     expect(response.body.data).toEqual({
    //       error: expect.stringContaining(`${categoryId}`),
    //     });
    //   });

    //   it('should throw error if incorrect categoryId', async () => {
    //     // Arrange
    //     const last = categoryBuilder.getDaos({ last: true, limit: 1 })[0].id;

    //     // Act
    //     const response = await request(app.getHttpServer())
    //       .post('/skills')
    //       .set(...credentials)
    //       .set('Content-Type', 'application/json')
    //       .send({
    //         name: 'new-name',
    //         description: 'default-skill',
    //         categoryId: last + 1,
    //       });

    //     // Assert
    //     expect(response.statusCode).toBe(404);
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
