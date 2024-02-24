import { UserUpdatedEvent } from '@app/contexts/auth/users';
import { createMock } from '@golevelup/ts-jest';
import { EntityId } from '@libs/common';
import { TestLoggerModule } from '@libs/testing';
import { Test } from '@nestjs/testing';

import { AuthUserFixture } from '../../models';
import { IAuthUsersRepository } from '../../repositories';
import { OnUserUpdatedHandler } from './on-user-updated.handler';

const userId = '4e16697f-8ea1-5d0a-b9c5-d2d358ee8ebe';

describe('OnUserUpdatedHandler', () => {
	let handler: OnUserUpdatedHandler;
	let authUserRepositoryMock: jest.Mocked<IAuthUsersRepository>;

	beforeEach(async () => {
		authUserRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot()],
			providers: [
				OnUserUpdatedHandler,
				{
					provide: IAuthUsersRepository,
					useValue: authUserRepositoryMock,
				},
			],
		}).compile();

		handler = app.get(OnUserUpdatedHandler);
	});

	const authUser = AuthUserFixture.create({
		email: 'old@email.com',
	});

	it('should update auth-user', async () => {
		// arrange
		const newEmail = 'new@email.com';
		const event = new UserUpdatedEvent({ id: new EntityId(userId), email: newEmail, profile: { userId: new EntityId(userId) } as any });

		authUserRepositoryMock.getByUserId.mockResolvedValueOnce(authUser);

		// act
		await handler.handle(event);

		// assert
		expect(authUserRepositoryMock.getByUserId).toHaveBeenCalledWith(userId);
		expect(authUserRepositoryMock.update).toHaveBeenCalledWith({
			...authUser,
			email: newEmail,
		});
	});
});
