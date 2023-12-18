import { createMock } from '@golevelup/ts-jest';
import { TestCqrsModule, TestLoggerModule } from '@libs/testing';
import { Test } from '@nestjs/testing';
import { IUsersCommandRepository, User } from '../../domain';
import { CreateUserCommand } from './create-user.command';
import { CreateUserHandler } from './create-user.handler';

describe('CreateUserHandler', () => {
	let handler: CreateUserHandler;
	let userCommandRepositoryMock: jest.Mocked<IUsersCommandRepository>;

	beforeEach(async () => {
		userCommandRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot(), TestCqrsModule],
			providers: [
				CreateUserHandler,
				{
					provide: IUsersCommandRepository,
					useValue: userCommandRepositoryMock,
				},
			],
		}).compile();

		handler = app.get(CreateUserHandler);
	});

	const command = new CreateUserCommand({
		hash: 'asdfadsfas',
		hashedRt: null,
		email: 'test@test.com',
		roleId: '34d90467-aeb4-4016-9791-86f9aec010e4',
	});

	describe('Success', () => {
		it('should create new user', async () => {
			// Arrange
			let saveduser: User;

			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				saveduser = aggregate;
			});

			// Act
			const result = await handler.execute(command);

			// Assert

			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
			expect(result).toStrictEqual({ id: expect.any(String) });
		});
	});
});
