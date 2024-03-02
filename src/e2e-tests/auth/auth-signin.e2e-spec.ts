import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppRoutes, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { ApiResponseStatusJsendEnum, UnauthorizedError } from '@libs/common';
import { TestLoggerModule, testingDefaults } from '@libs/testing';

import { AppModule } from '../../app.module';
import { UserSeedBuilder } from '../builders/user-builder';

type IDdbDaos = { [key: string]: unknown };

describe('AuthJwtControllerV1 -> signin (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;

  const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestLoggerModule.forRoot()],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dbConnection.destroy();
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);

      const seedBuilder = await UserSeedBuilder.create(trx);
      seedBuilder.withUser().withAuthUser();
      await seedBuilder.build();
    });
  });

  const defaultCorrectEmail = testingDefaults.email;
  const defaultcorrectPassword = testingDefaults.userPassword;

  describe('/auth/signin (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should return success and both tokens', async () => {
        // Act
        const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
          email: defaultCorrectEmail,
          password: defaultcorrectPassword,
        });

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe(ApiResponseStatusJsendEnum.SUCCESS);

        expect(response.body).toMatchSnapshot({
          timestamp: expect.any(String),
          data: {
            access_token: expect.any(String),
            refresh_token: expect.any(String),
          },
        });
      });
    });

    describe('FAILURE', () => {
      it('should return input validation errors', async () => {
        // Act
        const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
          email: null,
          password: 12,
        });

        // Assert
        expect(response.statusCode).toBe(400);
        expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
        expect(response.body).toMatchSnapshot({
          timestamp: expect.any(String),
          data: {
            subErrors: expect.any(Array),
            error: expect.any(String),
          },
        });
      });

      it('should return UnauthorizedError', async () => {
        // Act
        const response = await request(app.getHttpServer()).post(AppRoutes.AUTH.v1.signin).set('Content-Type', 'application/json').send({
          email: defaultCorrectEmail,
          password: 'incorrect-password',
        });

        // Assert
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
        expect(response.body.data?.error).toEqual(UnauthorizedError.message);
        expect(response.body).toMatchSnapshot({
          timestamp: expect.any(String),
        });
      });
    });
  });
});
