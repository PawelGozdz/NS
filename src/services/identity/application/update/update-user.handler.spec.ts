import { createMock } from '@golevelup/ts-jest';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';
import { Test } from '@nestjs/testing';

import { EntityId } from '@libs/common';
import { IUsersCommandRepository, User, UserNotFoundError } from '../../domain';
import { UpdateUserCommand } from './update-user.command';
import { UpdateUserHandler } from './update-user.handler';

describe('UpdateUserHandler', () => {
	let handler: UpdateUserHandler;
	let userCommandRepositoryMock: jest.Mocked<IUsersCommandRepository>;

	beforeEach(async () => {
		userCommandRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot(), TestCqrsModule],
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

	beforeEach(() => {
		jest.clearAllMocks();
	});

	const userId = new EntityId('34d90467-aeb4-4016-9791-86f9aec010e4');
	const hash = 'asdfadsfas';
	const hashedRt = 'some-hash';
	const email = 'test@test.com';
	const roleId = new EntityId('34d90467-aeb4-4016-9791-86f9aec010e4');

	const command = new UpdateUserCommand({
		id: userId.value,
		hash,
		hashedRt,
		email,
		roleId: roleId.value,
	});

	const user = new User({
		id: userId,
		roleId,
		email,
		hash,
		hashedRt,
	});

	describe('Success', () => {
		it('should update new user', async () => {
			// Arrange
			let copyUser: User;
			const newEmail = 'newemail@gmail.com';
			userCommandRepositoryMock.getOneById.mockResolvedValueOnce(user);
			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				copyUser = aggregate;
			});

			// Act
			await handler.execute({
				...command,
				email: newEmail,
			});

			// Assert
			const events = user.getUncommittedEvents();

			expect(events.length).toBe(1);
			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith({
				...user,
				email: newEmail,
			});
			expect(copyUser!.email).toBe(newEmail);
		});

		it('should update new user and set hashedRt as null', async () => {
			// Arrange
			let copyUser: User;
			userCommandRepositoryMock.getOneById.mockResolvedValueOnce(user);
			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				copyUser = aggregate;
			});

			// Act
			await handler.execute({
				...command,
				hashedRt: null,
			});

			// Assert
			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith({ ...user, hashedRt: null });
			expect(copyUser!.hashedRt).toStrictEqual(null);
		});
	});

	describe('Failure', () => {
		it('should throw UserNotFoundError', async () => {
			// Arrange
			let copyUser: User;
			userCommandRepositoryMock.getOneById.mockResolvedValueOnce(undefined);
			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				copyUser = aggregate;
			});

			// Act
			const { error } = await catchActError(() => handler.execute(command));

			// Assert
			expect(userCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
			expect(error).toBeInstanceOf(UserNotFoundError);
		});
	});
});
