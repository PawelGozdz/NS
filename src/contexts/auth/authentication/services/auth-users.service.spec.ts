import { CannotCreateUserError, CreateUserIntegrationEvent, GetUserByEmailIntegrationEvent, GetUserByIdIntegrationEvent } from '@app/core';
import { createMock } from '@golevelup/ts-jest';
import { TestLoggerModule, catchActError } from '@libs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { SignUpIntegrationDto } from '../dtos';
import { AuthUserFixture } from '../models';
import { IAuthUsersRepository } from '../repositories';
import { AuthUsersService } from './auth-users.service';

describe('AuthService', () => {
	let service: AuthUsersService;
	let authUsersRepositoryMock: jest.Mocked<IAuthUsersRepository>;
	let eventEmitterMock: jest.Mocked<EventEmitter2>;

	beforeEach(async () => {
		authUsersRepositoryMock = createMock();
		eventEmitterMock = createMock();

		const module: TestingModule = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot()],
			providers: [
				AuthUsersService,
				{
					provide: IAuthUsersRepository,
					useValue: authUsersRepositoryMock,
				},
				{
					provide: EventEmitter2,
					useValue: eventEmitterMock,
				},
			],
		}).compile();

		service = module.get<AuthUsersService>(AuthUsersService);
	});

	afterEach(() => {
		jest.clearAllMocks();
		jest.resetModules();
		jest.restoreAllMocks();
	});

	const authUser = AuthUserFixture.create();
	const user = {
		email: authUser.email,
		id: authUser.userId,
	};

	const userResp = {
		id: user.id,
	};

	const expectTokens = {
		lastLogin: expect.any(Date),
		tokenRefreshedAt: expect.any(Date),
	};

	describe('create', () => {
		it('should create user', async () => {
			// Arrange
			authUsersRepositoryMock.create.mockResolvedValue(userResp);

			// Act
			const result = await service.create(authUser);

			// Assert
			expect(result).toEqual(userResp);
			expect(result).toMatchSnapshot({
				id: expect.any(String),
			});
		});
	});

	describe('update', () => {
		it('should update user', async () => {
			// Arrange
			authUsersRepositoryMock.update.mockResolvedValue(void 0);

			// Act
			const result = await service.update(authUser);

			// Assert
			expect(result).toBeUndefined();
			expect(authUsersRepositoryMock.update).toHaveBeenNthCalledWith(1, authUser);
		});
	});

	describe('delete', () => {
		it('should delete user', async () => {
			// Arrange
			authUsersRepositoryMock.delete.mockResolvedValue(void 0);

			// Act
			const result = await service.delete(authUser.userId);

			// Assert
			expect(result).toBeUndefined();
			expect(authUsersRepositoryMock.delete).toHaveBeenNthCalledWith(1, authUser.userId);
		});
	});

	describe('getByUserId', () => {
		it('should return user with getByUserId', async () => {
			// Arrange
			authUsersRepositoryMock.getByUserId.mockResolvedValue(authUser);

			// Act
			const result = await service.getByUserId(authUser.userId);

			// Assert
			expect(result).toEqual(authUser);
			expect(authUsersRepositoryMock.getByUserId).toHaveBeenNthCalledWith(1, authUser.userId);
		});
	});

	describe('getByUserEmail', () => {
		it('should return user with getByUserEmail', async () => {
			// Arrange
			authUsersRepositoryMock.getByUserEmail.mockResolvedValue(authUser);

			// Act
			const result = await service.getByUserEmail(authUser.email);

			// Assert
			expect(result).toEqual(authUser);
			expect(authUsersRepositoryMock.getByUserEmail).toHaveBeenNthCalledWith(1, authUser.email);
		});
	});

	describe('getIntegrationUserById', () => {
		it('should return user with getIntegrationUserById', async () => {
			// Arrange
			eventEmitterMock.emitAsync.mockResolvedValue([user]);
			const paramEvent = new GetUserByIdIntegrationEvent(authUser.userId);
			paramEvent.integrationEventId = expect.any(String);
			paramEvent.integrationEventOccuredON = expect.any(Date);

			// Act
			const result = await service.getIntegrationUserById(authUser.userId);

			// Assert
			expect(result).toEqual(user);
			expect(eventEmitterMock.emitAsync).toHaveBeenNthCalledWith(1, GetUserByIdIntegrationEvent.eventName, paramEvent);
		});
	});

	describe('getIntegrationUserByEmail', () => {
		it('should return user with getIntegrationUserByEmail', async () => {
			// Arrange
			eventEmitterMock.emitAsync.mockResolvedValue([user]);
			const paramEvent = new GetUserByEmailIntegrationEvent(authUser.email);
			paramEvent.integrationEventId = expect.any(String);

			// Act
			const result = await service.getIntegrationUserByEmail(authUser.email);

			// Assert
			expect(result).toEqual(user);
			expect(eventEmitterMock.emitAsync).toHaveBeenNthCalledWith(1, GetUserByEmailIntegrationEvent.eventName, paramEvent);
		});
	});

	describe('createIntegrationUser', () => {
		const dto: SignUpIntegrationDto = {
			email: 'test@example.com',
		};

		describe('success', () => {
			it('should return user created id', async () => {
				// Arrange
				eventEmitterMock.emitAsync.mockResolvedValue([userResp]);
				const paramEvent = new CreateUserIntegrationEvent({
					email: dto.email,
					...expectTokens,
				});
				paramEvent.integrationEventId = expect.any(String);

				// Act
				const result = await service.createIntegrationUser(dto);

				// Assert
				expect(result).toEqual(userResp);
				expect(eventEmitterMock.emitAsync).toHaveBeenNthCalledWith(1, CreateUserIntegrationEvent.eventName, paramEvent);
			});
		});

		describe('failure', () => {
			it('should throw CannotCreateUserError if no user returned', async () => {
				// Arrange
				eventEmitterMock.emitAsync.mockRejectedValueOnce(CannotCreateUserError.failed());
				const paramEvent = new CreateUserIntegrationEvent({
					email: dto.email,
					...expectTokens,
				});
				paramEvent.integrationEventId = expect.any(String);

				// Act
				const { error } = await catchActError(() => service.createIntegrationUser(dto));

				// Assert
				expect(error).toBeInstanceOf(CannotCreateUserError);
				expect(eventEmitterMock.emitAsync).toHaveBeenNthCalledWith(1, CreateUserIntegrationEvent.eventName, paramEvent);
			});
		});
	});
});
