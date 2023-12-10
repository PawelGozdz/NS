import { createMock } from '@golevelup/ts-jest';
import { TestLoggerModule } from '@libs/testing';
import { Test } from '@nestjs/testing';

import { IUsersCommandRepository, User } from '../../domain';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserHandler } from './update-user.handler';

describe('UpdateUserHandler', () => {
	let handler: UpdateUserHandler;
	let userCommandRepositoryMock: jest.Mocked<IUsersCommandRepository>;

	beforeEach(async () => {
		userCommandRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot()],
			providers: [
				UpdateUserHandler,
				{
					provide: IUsersCommandRepository,
					useValue: userCommandRepositoryMock,
				},
			],
		}).compile();

		handler = app.get(UpdateUserHandler);
	});

	const userId = '34d90467-aeb4-4016-9791-86f9aec01011';
	const command = new UpdateUserCommand({
		id: userId,
		hash: 'asdfadsfas',
		hashedRt: 'some-hash',
		email: 'test@test.com',
		roleId: '34d90467-aeb4-4016-9791-86f9aec010e4',
	});

	describe('Success', () => {
		it('should update new user', async () => {
			// Arrange
			let user: User;

			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				user = aggregate;
			});

			// Act
			const result = await handler.execute(command);

			// Assert

			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
			expect(result).toStrictEqual({ id: expect.any(String) });
		});

		it('should update new user and set hashedRt as null', async () => {
			// Arrange
			let user: User;

			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				user = aggregate;
			});

			// Act
			await handler.execute({
				...command,
				hashedRt: null,
			});

			// Assert

			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
			expect(user!.hashedRt).toStrictEqual(null);
		});
	});
});
