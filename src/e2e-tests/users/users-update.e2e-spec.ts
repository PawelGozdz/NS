import { TestingE2EFunctions } from '@app/database/kysley';
import { AuthenticationServer, TestLoggerModule } from '@libs/testing';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Kysely } from 'kysely';
import request from 'supertest';

import { UpdateUserDto } from '@app/api-gateway/auth/http/user-dtos';
import { HashService } from '@app/contexts/auth';
import { AppModule } from '../../app.module';
import { TableNames, dialect, kyselyPlugins } from '../../database';
import { getCookies, loginUser } from '../builders/auth-user';
import { UserSeedBuilder } from '../builders/user-builder';
// import { UpdateUserDto } from '@app/api-gateway/auth';

type IDdbDaos = any;

describe('UsersControllerV1 -> update (e2e)', () => {
	const dbConnection = new Kysely<IDdbDaos>({
		dialect,
		plugins: kyselyPlugins,
	});
	const dbUtils = new TestingE2EFunctions(dbConnection);
	let app: INestApplication;
	let authenticationServer: AuthenticationServer;
	let hashService: HashService;

	const tablesInvolved = [TableNames.USERS, TableNames.AUTH_USERS, TableNames.USER_PROFILES];

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule, TestLoggerModule.forRoot()],
			providers: [HashService],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();

		authenticationServer = new AuthenticationServer();
		hashService = app.get(HashService);
	});

	afterAll(async () => {
		await dbConnection.destroy();
		await app.close();
	});

	let cookies: [string, string];
	let builder: UserSeedBuilder;

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

				const user = await dbConnection
					.selectFrom(TableNames.AUTH_USERS)
					.selectAll()
					.where('userId', '=', builder.authUserDao.userId)
					.executeTakeFirst();

				// Assert
				expect(response.statusCode).toBe(200);
				expect(user!.email).toBe(bodyDto.email);
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
