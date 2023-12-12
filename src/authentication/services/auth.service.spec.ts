import { createMock } from '@golevelup/ts-jest';
import {
	CannotCreateUserError,
	ConflictError,
	CreateUserIntegrationEvent,
	GetUserByEmailIntegrationEvent,
	GetUserByIdIntegrationEvent,
	IUser,
	SignUpDto,
	UpdateUserIntegrationEvent,
} from '@libs/common';
import { catchActError } from '@libs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { ITokens } from '../types';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';

describe('AuthService', () => {
	let service: AuthService;
	let hashServiceMock: jest.Mocked<HashService>;
	let eventEmitterMock: jest.Mocked<EventEmitter2>;
	let jwtServiceMock: jest.Mocked<JwtService>;

	beforeEach(async () => {
		hashServiceMock = createMock();
		eventEmitterMock = createMock();
		jwtServiceMock = createMock();

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: HashService,
					useValue: hashServiceMock,
				},
				{
					provide: EventEmitter2,
					useValue: eventEmitterMock,
				},
				{
					provide: JwtService,
					useValue: jwtServiceMock,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
	});

	const dto: SignUpDto = {
		email: 'test@example.com',
		password: 'password',
		roleId: 'roleId',
	};

	describe('createUser', () => {
		describe('success', () => {
			it('should create a user and return their id', async () => {
				// Arrange
				const hash = 'hashedPassword';
				const user = [{ id: 'userId' }];
				hashServiceMock.hashData.mockResolvedValue(hash);
				eventEmitterMock.emitAsync.mockResolvedValue(user);

				// Act
				const result = await service.createUser(dto);

				// Assert
				expect(result).toEqual({ id: user[0].id });
				expect(hashServiceMock.hashData).toHaveBeenCalledWith(dto.password);
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(CreateUserIntegrationEvent.eventName, expect.any(CreateUserIntegrationEvent));
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw CannotCreateUserError if user creation fails', async () => {
				// Arrange
				const hash = 'hashedPassword';

				hashServiceMock.hashData.mockResolvedValue(hash);
				eventEmitterMock.emitAsync.mockResolvedValue([undefined]);

				// Act
				const { error } = await catchActError(() => service.createUser(dto));

				// Assert
				expect(error).toBeInstanceOf(CannotCreateUserError);
				expect(error).toMatchSnapshot();
			});

			it('should throw ConflictError if user with the same email already exists', async () => {
				// Arrange
				const hash = 'hashedPassword';
				const err = { code: 'P2002' };

				hashServiceMock.hashData.mockResolvedValue(hash);
				eventEmitterMock.emitAsync.mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.createUser(dto));

				// Assert
				expect(error).toBeInstanceOf(ConflictError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getUserById', () => {
		const id = 'userId';

		describe('success', () => {
			it('should return a user', async () => {
				// Arrange
				const user = { id, email: 'test@example.com' };
				eventEmitterMock.emitAsync.mockResolvedValue([user]);

				// Act
				const result = await service.getUserById(id);

				// Assert
				expect(result).toEqual(user);
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(GetUserByIdIntegrationEvent.eventName, expect.any(GetUserByIdIntegrationEvent));
				expect(result).toMatchSnapshot();
			});
		});
	});

	describe('getUserByEmail', () => {
		const email = 'test@test.com';

		describe('success', () => {
			it('should return a user', async () => {
				// Arrange
				const user = { id: 'userId', email };
				eventEmitterMock.emitAsync.mockResolvedValue([user]);

				// Act
				const result = await service.getUserByEmail(email);

				// Assert
				expect(result).toEqual(user);
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(GetUserByEmailIntegrationEvent.eventName, expect.any(GetUserByEmailIntegrationEvent));
				expect(result).toMatchSnapshot();
			});
		});
	});

	describe('updateUser', () => {
		const user: Partial<IUser> & { id: string } = {
			id: 'userId',
			hash: 'hashedPassword',
			hashedRt: 'hashedRt',
			email: 'test@example.com',
			roleId: 'roleId',
		};

		describe('success', () => {
			it('should update a user', async () => {
				// Arrange
				eventEmitterMock.emitAsync.mockResolvedValue([void 0]);

				// Act
				await service.updateUser(user);

				// Assert
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(UpdateUserIntegrationEvent.eventName, expect.any(UpdateUserIntegrationEvent));
			});

			it('should throw ConflictError if user with the same email already exists', async () => {
				// Arrange
				const err = { code: 'P2002' };
				eventEmitterMock.emitAsync.mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.updateUser(user));

				// Assert
				expect(error).toBeInstanceOf(ConflictError);
				expect(error).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should propagate the error if an unknown error occurs', async () => {
				// Arrange
				const err = new Error('Unknown error');
				eventEmitterMock.emitAsync.mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.updateUser(user));

				// Assert
				expect(error).toBe(err);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('signup', () => {
		const userId = 'userId';
		const tokens: ITokens = {
			access_token: 'access_token',
			refresh_token: 'refresh_token',
		};
		const hashedPassword = 'hashedPassword';

		beforeEach(() => {
			service.getTokens = jest.fn().mockResolvedValue(tokens);
			service.updateHash = jest.fn().mockResolvedValue(hashedPassword);
			service.updateUser = jest.fn().mockResolvedValue(undefined);
		});

		describe('success', () => {
			it('should get tokens, update hash and update user', async () => {
				// Act
				const result = await service.signup(userId);

				// Assert
				expect(result).toEqual(tokens);
				expect(service.getTokens).toHaveBeenCalledWith(userId);
				expect(service.updateHash).toHaveBeenCalledWith(tokens.refresh_token);
				expect(service.updateUser).toHaveBeenCalledWith({
					id: userId,
					hash: hashedPassword,
				});
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw an error if getTokens fails', async () => {
				// Arrange
				const err = new Error('getTokens error');
				service.getTokens = jest.fn().mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toEqual(err.message);
			});

			it('should throw an error if updateHash fails', async () => {
				// Arrange
				const err = new Error('updateHash error');
				service.updateHash = jest.fn().mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toBe(err.message);
			});

			it('should throw an error if updateUser fails', async () => {
				// Arrange
				const err = new Error('updateUser error');
				service.updateUser = jest.fn().mockRejectedValue(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toBe(err.message);
			});
		});
	});
});
