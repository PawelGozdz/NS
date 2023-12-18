import { createMock } from '@golevelup/ts-jest';
import {
	CannotCreateUserError,
	ConflictError,
	CreateUserIntegrationEvent,
	GetUserByIdIntegrationEvent,
	IUser,
	SignInDto,
	SignUpDto,
	UnauthorizedError,
	UpdateUserIntegrationEvent,
} from '@libs/common';
import { catchActError } from '@libs/testing';
import { JwtService } from '@nestjs/jwt';

import { EventEmitter2 } from '@nestjs/event-emitter';
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

	afterEach(() => {
		jest.clearAllMocks();
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
				const user = { id: 'userId' };
				hashServiceMock.hashData.mockResolvedValueOnce(hash);
				eventEmitterMock.emitAsync.mockResolvedValueOnce([user]);

				// Act
				const result = await service.createUser(dto);

				// Assert
				expect(result).toEqual({ id: user.id });
				expect(hashServiceMock.hashData).toHaveBeenCalledWith(dto.password);
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(CreateUserIntegrationEvent.eventName, expect.any(CreateUserIntegrationEvent));
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw CannotCreateUserError if user creation fails', async () => {
				// Arrange
				const hash = 'hashedPassword';

				hashServiceMock.hashData.mockResolvedValueOnce(hash);
				eventEmitterMock.emitAsync.mockResolvedValueOnce([undefined]);

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

				hashServiceMock.hashData.mockResolvedValueOnce(hash);
				eventEmitterMock.emitAsync.mockRejectedValueOnce(err);

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
			it('should return a user by Id', async () => {
				// Arrange
				const user = { id, email: 'test@example.com' };
				eventEmitterMock.emitAsync.mockResolvedValueOnce([user]);

				// Act
				const result = await service.getUserById(id);

				// Assert
				expect(result).toEqual(user);
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(GetUserByIdIntegrationEvent.eventName, expect.any(GetUserByIdIntegrationEvent));
				expect(result).toMatchSnapshot();
			});
		});
	});

	// describe('getUserByEmail', () => {
	// 	const email = 'test@test.com';

	// 	describe('success', () => {
	// 		it('should return a user by email', async () => {
	// 			// Arrange
	// 			const user = { email };
	// 			eventEmitterMock.emitAsync.mockResolvedValueOnce([user]);

	// 			// Act
	// 			const result = await service.getUserByEmail(email);

	// 			// Assert
	// 			expect(result).toBe(user);
	// 			expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(GetUserByEmailIntegrationEvent.eventName, expect.any(GetUserByEmailIntegrationEvent));
	// 			expect(result).toMatchSnapshot();
	// 		});
	// 	});
	// });

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
				eventEmitterMock.emitAsync.mockResolvedValueOnce([void 0]);

				// Act
				await service.updateUser(user);

				// Assert
				expect(eventEmitterMock.emitAsync).toHaveBeenCalledWith(UpdateUserIntegrationEvent.eventName, expect.any(UpdateUserIntegrationEvent));
			});

			it('should throw ConflictError if user with the same email address already exists', async () => {
				// Arrange
				const err = { code: 'P2002' };
				eventEmitterMock.emitAsync.mockRejectedValueOnce(err);

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
				eventEmitterMock.emitAsync.mockRejectedValueOnce(err);

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

		service.getTokens = jest.fn().mockResolvedValueOnce(tokens);
		service.updateHash = jest.fn().mockResolvedValueOnce(hashedPassword);
		service.updateUser = jest.fn().mockResolvedValueOnce(undefined);

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
				service.getTokens = jest.fn().mockRejectedValueOnce(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toEqual(err.message);
			});

			it('should throw an error if updateHash fails', async () => {
				// Arrange
				const err = new Error('updateHash error');
				service.updateHash = jest.fn().mockRejectedValueOnce(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toBe(err.message);
				expect(error).toMatchSnapshot();
			});

			it('should throw an error if updateUser fails', async () => {
				// Arrange
				const err = new Error('updateUser error');
				service.updateUser = jest.fn().mockRejectedValueOnce(err);

				// Act
				const { error } = await catchActError(() => service.signup(userId));

				// Assert
				expect(error!.message).toBe(err.message);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('signin', () => {
		const dto: SignInDto = {
			email: 'test@example.com',
			password: 'password',
		};
		const user = {
			id: 'userId',
			email: dto.email,
			hash: 'hashedPassword',
		} as IUser;
		const tokens: ITokens = {
			access_token: 'accessToken',
			refresh_token: 'refreshToken',
		};

		beforeEach(() => {
			service.getUserByEmail = jest.fn().mockResolvedValue(user);
			service.verifyTextToHash = jest.fn().mockResolvedValue(true);
			service.getTokens = jest.fn().mockResolvedValue(tokens);
		});

		describe('success', () => {
			it('should return signin user and return tokens', async () => {
				// Act
				const result = await service.signin(dto, user);

				// Assert
				expect(result).toEqual(tokens);
				expect(service.verifyTextToHash).toHaveBeenCalledWith(user.hash, dto.password);
				expect(service.getTokens).toHaveBeenCalledWith(user.id);
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if password is not valid', async () => {
				// Arrange
				service.verifyTextToHash = jest.fn().mockResolvedValue(false);

				// Act
				const { error } = await catchActError(() => service.signin(dto, user));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});

			it('should throw UnauthorizedError if user not found', async () => {
				// Arrange
				// Act
				const { error } = await catchActError(() => service.signin(dto, null as unknown as IUser));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});
		});
	});

	describe('getAuthenticatedUserWithEmailAndPassword', () => {
		const email = 'test@example.com';
		const password = 'password';
		const hash = 'hashedPassword';
		let user: IUser;

		beforeEach(() => {
			service.getUserByEmail = jest.fn().mockResolvedValueOnce(user);

			user = {
				id: 'userId',
				email: email,
				hash: hash,
			} as IUser;
		});

		describe('success', () => {
			it('should return the user if email and password are valid', async () => {
				// Arrange
				service.getUserByEmail = jest.fn().mockResolvedValueOnce(user);
				service.verifyTextToHash = jest.fn().mockResolvedValueOnce(true);

				// Act
				const result = await service.getAuthenticatedUserWithEmailAndPassword(email, password);

				// Assert
				expect(result).toEqual(user);
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if password is not a string', async () => {
				// Arrange
				const invalidPasswords = [null, undefined, {}, 0, NaN];

				for (const invalidPassword of invalidPasswords) {
					// Act
					const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(email, invalidPassword as any));

					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
				}
			});

			it('should throw UnauthorizedError if email is not a string', async () => {
				// Arrange
				service.verifyTextToHash = jest.fn().mockResolvedValueOnce(false);
				const invalidEmails = [null, undefined, {}];

				for (const invalidEmail of invalidEmails) {
					// Act
					const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(invalidEmail as string, password));

					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
				}
			});

			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				service.getUserByEmail = jest.fn().mockResolvedValueOnce(null);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(email, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});

			it('should throw UnauthorizedError if password does not match', async () => {
				// Arrange
				service.getUserByEmail = jest.fn().mockResolvedValueOnce(user);
				service.verifyTextToHash = jest.fn().mockResolvedValueOnce(false);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(email, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});
		});
	});

	describe('getAuthenticatedUserWithJwt', () => {
		const userId = 'userId';
		const user = {
			id: userId,
			email: 'test@example.com',
			hash: 'hashedPasswordasdf',
		} as IUser;

		beforeEach(() => {
			service.getUserById = jest.fn().mockResolvedValue(user);
		});

		describe('success', () => {
			it('should return the user if userId is valid', async () => {
				// Act
				const result = await service.getAuthenticatedUserWithJwt(userId);

				// Assert
				expect(result).toEqual(user);
				expect(service.getUserById).toHaveBeenCalledWith(userId);
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if userId is not a string', async () => {
				// Arrange
				const invalidUserIds = [null, undefined, {}, []];

				for (const invalidUserId of invalidUserIds) {
					// Act
					const { error } = await catchActError(() => service.getAuthenticatedUserWithJwt(invalidUserId as any));

					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
					expect(error).toMatchSnapshot();
				}
			});

			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				service.getUserById = jest.fn().mockResolvedValue(null);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithJwt(userId));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getAuthenticatedUserWithRefreshToken', () => {
		const refreshToken = 'refreshToken';
		const userId = 'userId';
		const user = {
			id: userId,
			email: 'test@example.com',
			hash: 'hashedPassword1234',
			hashedRt: 'hashedRt',
		} as IUser;

		beforeEach(() => {
			service.getUserById = jest.fn().mockResolvedValue(user);
		});

		describe('success', () => {
			it('should return the user if refreshToken is valid', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValueOnce(true);
				// Act
				const result = await service.getAuthenticatedUserWithRefreshToken(userId, refreshToken);

				// Assert
				expect(result).toEqual(user);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(user.hashedRt, refreshToken);
				expect(service.getUserById).toHaveBeenCalledWith(userId);
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if refreshToken is not a string', async () => {
				// Arrange
				const invalidRefreshTokens = [null, undefined, {}, []];

				for (const invalidRefreshToken of invalidRefreshTokens) {
					// Act
					const { error } = await catchActError(() => service.getAuthenticatedUserWithRefreshToken(userId, invalidRefreshToken as any));

					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
				}
			});

			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				service.getUserById = jest.fn().mockResolvedValue(null);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithRefreshToken(refreshToken));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});
		});
	});

	describe('logout', () => {
		const userId = 'useId2';

		describe('success', () => {
			it('should call updateUser', async () => {
				// Arrange
				service.updateUser = jest.fn().mockResolvedValueOnce(undefined);

				// Act
				await service.logout(userId);

				// Assert
				expect(service.updateUser).toHaveBeenCalledWith({
					id: userId,
					hashedRt: null,
				});
			});
		});
	});

	describe('refreshTokens', () => {
		const refreshToken = 'refreshToken';
		const hashedRefreshToken = 'hashedRefreshToken';
		const userId = 'userId';
		const user = {
			id: userId,
			email: 'test@example.com',
			hash: 'hashedPassword',
			hashedRt: hashedRefreshToken,
		} as IUser;
		const tokens: ITokens = {
			access_token: 'accessToken',
			refresh_token: 'newRefreshToken',
		};

		beforeEach(() => {
			hashServiceMock.hashAndTextVerify.mockResolvedValue(true);
			service.getTokens = jest.fn().mockResolvedValue(tokens);
			service.updateHash = jest.fn().mockResolvedValue(hashedRefreshToken);
			service.updateUser = jest.fn().mockResolvedValue(undefined);
		});

		describe('success', () => {
			it('should return new tokens if refreshToken is valid', async () => {
				// Act
				const result = await service.refreshTokens(user, refreshToken);

				// Assert
				expect(result).toEqual(tokens);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(user.hashedRt, refreshToken);
				expect(service.getTokens).toHaveBeenCalledWith(user.id);
				expect(service.updateHash).toHaveBeenCalledWith(tokens.refresh_token);
				expect(service.updateUser).toHaveBeenCalledWith({ ...user, hashedRt: hashedRefreshToken });
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if refreshToken is not a string or user does not exist or user.hashedRt does not exist', async () => {
				// Arrange
				const invalidInputs = [
					[null, refreshToken],
					[user, null],
					[{ ...user, hashedRt: null }, refreshToken],
				];

				for (const [invalidUser, invalidRefreshToken] of invalidInputs) {
					// Act
					const { error } = await catchActError(() => service.refreshTokens(invalidUser as IUser, invalidRefreshToken as string));

					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
				}
			});

			it('should throw UnauthorizedError if refreshToken does not match user.hashedRt', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValue(false);

				// Act
				const { error } = await catchActError(() => service.refreshTokens(user, refreshToken));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
			});
		});
	});

	describe('verifyTextToHash', () => {
		const hash = 'hashedPassword';
		const password = 'password1234';

		beforeEach(() => {
			hashServiceMock.hashAndTextVerify.mockResolvedValue(true);
		});

		describe('success', () => {
			it('should return true if password matches hash', async () => {
				// Act
				const result = await service.verifyTextToHash(hash, password);

				// Assert
				expect(result).toBe(true);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(hash, password);
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if hashAndTextVerify doesnt return bool', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValueOnce(5 as unknown as boolean);

				// Act
				const { error } = await catchActError(() => service.verifyTextToHash(hash, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(hash, password);
			});
		});
	});
});
