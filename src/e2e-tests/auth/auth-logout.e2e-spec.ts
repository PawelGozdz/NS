import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { HashService } from '@app/contexts';
import { ApiResponseStatusJsendEnum, AppRoutes, IDatabaseModels, dialect, kyselyPlugins } from '@app/core';
import { UnauthorizedError } from '@libs/common';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';

type IDdbDaos = IDatabaseModels;

describe('AuthJwtControllerV1 -> logout (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [HashService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await dbConnection.destroy();
    await app.close();
  });

  let cookies: [string, string];

  beforeEach(async () => {
    cookies = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      await loginUser(trx);
    });
  });

  describe('/auth/logout (POST) V1', () => {
    describe('SUCCESS', () => {
      it('should return both tokens if refresh token is still valid', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .post(AppRoutes.AUTH.v1.logout)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send();

        // Assert
        expect(response.statusCode).toBe(204);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('FAILURE', () => {
      it('should return UnauthorizedError if incorrect refreshToken', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .post(AppRoutes.AUTH.v1.logout)
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
