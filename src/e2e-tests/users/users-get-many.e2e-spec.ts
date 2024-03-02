import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { AppModule } from '@app/app.module';
import { HashService } from '@app/contexts';
import { AppRoutes, dialect, kyselyPlugins } from '@app/core';
import { TestLoggerModule } from '@libs/testing';

import { getCookies, loginUser } from '../builders/auth-user';

type IDdbDaos = { [key: string]: unknown };

describe('UsersControllerV1 -> getMany (e2e)', () => {
  const dbConnection = new Kysely<IDdbDaos>({
    dialect,
    plugins: kyselyPlugins,
  });
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestLoggerModule.forRoot()],
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

  describe('/users (GET) V1', () => {
    describe('SUCCESS', () => {
      it('should return a list of users with at least one record', async () => {
        // Arrange

        // Act
        const response = await request(app.getHttpServer())
          .get(AppRoutes.USERS.v1.getUsers)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send();

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(1);
      });

      it('should return an empty list of users if not found any', async () => {
        // Act
        const response = await request(app.getHttpServer())
          .get(`${AppRoutes.USERS.v1.getUsers}?_filter[email]=t@test.com`)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send();

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data.length).toBe(0);
      });
    });
  });
});
