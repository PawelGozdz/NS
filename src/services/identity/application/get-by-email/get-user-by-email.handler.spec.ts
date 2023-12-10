import { createMock } from '@golevelup/ts-jest';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';
import { Test } from '@nestjs/testing';
import { IUsersQueryRepository, UserInfo, UserNotFoundError } from '../../domain';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByEmailQuery } from './get-user-by-email.query';

describe('GetUserByIdQuery', () => {
	let userQueryRepositoryMock: jest.Mocked<IUsersQueryRepository>;
	let handler: GetUserByEmailHandler;

	const userEmail = 'test5@gmail.com';

	const query = new GetUserByEmailQuery({ email: userEmail });
	const UserInfo: UserInfo = {
		id: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
		hash: 'hash',
		hashedRt: 'hashedRt',
		email: userEmail,
		roleId: 'roleId',
	};

	beforeEach(async () => {
		userQueryRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot(), TestCqrsModule],
			providers: [
				GetUserByEmailHandler,
				{
					provide: IUsersQueryRepository,
					useValue: userQueryRepositoryMock,
				},
			],
		}).compile();

		handler = app.get(GetUserByEmailHandler);
	});

	describe('Success', () => {
		it('should return user', async () => {
			userQueryRepositoryMock.getOneById.mockResolvedValueOnce(UserInfo);

			const result = await handler.execute(query);

			expect(result).toEqual(UserInfo);
		});
	});

	describe('Failure', () => {
		it('should throw an error when user does not exist', async () => {
			userQueryRepositoryMock.getOneById.mockResolvedValueOnce(undefined);

			const { error } = await catchActError(async () => {
				await handler.execute(query);
			});

			expect(error).toBeInstanceOf(UserNotFoundError);
		});
	});
});
