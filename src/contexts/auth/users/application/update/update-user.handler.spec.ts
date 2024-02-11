import { createMock } from '@golevelup/ts-jest';
import { ConflictError, EntityId } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';
import { Test } from '@nestjs/testing';

import { IUsersCommandRepository, User, UserAggregateRootFixtureFactory, UserNotFoundError, UserUpdatedEvent } from '../../domain';
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
	const email = 'test@test.com';

	const command = new UpdateUserCommand({
		id: userId.value,
		email,
	});

	const user = UserAggregateRootFixtureFactory.create({
		email,
		id: userId.value,
	});

	describe('Success', () => {
		it('should update new user', async () => {
			// Arrange
			let copyUser: User;
			const newEmail = 'newemail@gmail.com';
			userCommandRepositoryMock.getOneById.mockResolvedValueOnce(user);
			userCommandRepositoryMock.getOneByEmail.mockResolvedValueOnce(user);

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
			expect(events[0]).toBeInstanceOf(UserUpdatedEvent);
			expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(user);
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

		it('should throw ConflictError', async () => {
			// Arrange
			const takenEmail = 'taken@email.com';
			const otherUser = UserAggregateRootFixtureFactory.create({
				email: takenEmail,
			});
			let copyUser: User;
			userCommandRepositoryMock.getOneById.mockResolvedValueOnce(user);
			userCommandRepositoryMock.getOneByEmail.mockResolvedValueOnce(otherUser);
			userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
				copyUser = aggregate;
			});

			// Act
			const { error } = await catchActError(() =>
				handler.execute({
					...command,
					email: takenEmail,
				}),
			);

			// Assert
			expect(userCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
			expect(error).toBeInstanceOf(ConflictError);
		});
	});
});
