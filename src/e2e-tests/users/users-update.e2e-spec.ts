import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { UpdateUserDto } from '@app/api-gateway/auth';
import { HashService } from '@app/contexts';
import { TableNames, TestingE2EFunctions, dialect, kyselyPlugins } from '@app/core';
import { IDatabaseModels } from '@libs/common';
import { TestLoggerModule } from '@libs/testing';

import { AppModule } from '../../app.module';
import { getCookies, loginUser } from '../builders/auth-user';
import { UserSeedBuilder } from '../builders/user-builder';

type IDdbDaos = IDatabaseModels;

describe('UsersControllerV1 -> update (e2e)', () => {
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
  let builder: UserSeedBuilder;
  let dataAssertion: { email?: string };

  beforeEach(async () => {
    cookies = getCookies();

    await dbConnection.transaction().execute(async (trx) => {
      builder = await loginUser(trx);
    });
  });

  describe('/users/:id (PATCH) V1', () => {
    describe('SUCCESS', () => {
      it('should update user and profile', async () => {
        // Arrange
        const bodyDto: UpdateUserDto = { email: 'abc@test.com' };

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/users/${builder.authUserDao.userId}`)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send(bodyDto);

        const user = (await dbConnection
          .selectFrom(TableNames.AUTH_USERS)
          .selectAll()
          .where('userId', '=', builder.authUserDao.userId)
          .executeTakeFirst()) as typeof dataAssertion;

        // Assert
        expect(response.statusCode).toBe(200);
        expect(user.email).toBe(bodyDto.email);
      });
    });
    describe('FAILURE', () => {
      it('should throw ConflictError', async () => {
        // Arrange
        const takenEmail = 'taken@email.com';

        await dbConnection.transaction().execute(async (trx) => {
          await dbUtils.truncateTables(tablesInvolved, trx);

          const seedBuilder = await UserSeedBuilder.create(trx);
          seedBuilder.withUser({ email: takenEmail }).withAuthUser({ email: takenEmail }).withProfile();

          builder = await seedBuilder.build();
        });
        const bodyDto: UpdateUserDto = { email: takenEmail };

        // Act
        const response = await request(app.getHttpServer())
          .patch(`/users/${builder.authUserDao.userId}`)
          .set(...cookies)
          .set('Content-Type', 'application/json')
          .send(bodyDto);

        // Assert
        expect(response.statusCode).toBe(409);
        expect(response.body).toMatchSnapshot({
          ...response.body,
          timestamp: expect.any(String),
        });
      });
    });
  });
});
