import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { HashService } from '@app/contexts';
import { ApiResponseStatusJsendEnum, AppRoutes, IDatabaseModels, TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { UnauthorizedError } from '@libs/common';

import { AppModule } from '../../app.module';
import { getCookies, getRefreshToken } from '../builders/auth-user';
import { UserSeedBuilder } from '../builders/user-builder';

type IDdbDaos = IDatabaseModels;

describe('AuthJwtControllerV1 -> refresh (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  const dbUtils = new TestingE2EFunctions(dbConnection);
  let app: INestApplication;
  let hashService: HashService;

  const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [HashService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    hashService = app.get(HashService);
  });

  afterAll(async () => {
    await dbConnection.destroy();
    await app.close();
  });

  let cookies: [string, string];

  beforeEach(async () => {
    cookies = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await dbUtils.truncateTables(tablesInvolved, trx);

      const seedBuilder = await UserSeedBuilder.create(trx);
      seedBuilder.withUser().withAuthUser({
        hashedRt: await hashService.hashData(getRefreshToken()),
      });
      await seedBuilder.build();
    });
  });

  describe('/auth/refresh (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should return both tokens if refresh token is still valid', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .post(AppRoutes.AUTH.v1.refresh)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send();

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
      it('should return UnauthorizedError if incorrect refreshToken', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .post(AppRoutes.AUTH.v1.refresh)
          .set('Cookie', 'incorrect-cookie')
          .set('Content-Type', 'application/json')
          .send();

        // Assert
        expect(response.statusCode).toBe(401);
        expect(response.body.status).toBe(ApiResponseStatusJsendEnum.FAIL);
        expect(response.body).toMatchSnapshot({
          timestamp: expect.any(String),
          data: {
            error: UnauthorizedError.message,
          },
        });
      });
    });
  });
});
