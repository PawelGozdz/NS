import { createMock } from '@golevelup/ts-jest';
import { CannotCreateUserError, ConflictError, EntityId, SignInDto, SignUpDto, UnauthorizedError } from '@libs/common';
import { TestLoggerModule, catchActError } from '@libs/testing';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AuthUserFixture } from '../models/auth-user.fixture';
import { ITokens } from '../types';
import { AuthUsersService } from './auth-users.service';
import { AuthService } from './auth.service';
import { HashService } from './hash.service';

describe('AuthService', () => {
	let service: AuthService;
	let hashServiceMock: jest.Mocked<HashService>;
	let authUsersServiceMock: jest.Mocked<AuthUsersService>;
	let jwtServiceMock: jest.Mocked<JwtService>;

	beforeEach(async () => {
		hashServiceMock = createMock();
		authUsersServiceMock = createMock();
		jwtServiceMock = createMock();

		const module: TestingModule = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot()],
			providers: [
				AuthService,
				{
					provide: HashService,
					useValue: hashServiceMock,
				},
				{
					provide: AuthUsersService,
					useValue: authUsersServiceMock,
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
		jest.resetModules();
		jest.restoreAllMocks();
	});

	const dto: SignUpDto = {
		email: 'test@example.com',
		password: 'password',
		roleId: 'roleId',
	};

	const password = 'password';
	const hashedPassword = 'hashedPassword';
	const refreshToken = 'refreshToken';
	const hashedRefreshToken = 'hashedRefreshToken';

	const tokens: ITokens = {
		access_token: 'accessToken',
		refresh_token: 'newRefreshToken',
	};

	describe('createUser', () => {
		const user = { id: '6a0ee9ee-a36d-45c6-b264-1f06bf144b9a' };
		describe('success', () => {
			it('should create a user and return their id', async () => {
				// Arrange

				hashServiceMock.hashData.mockResolvedValueOnce(hashedPassword);
				authUsersServiceMock.createIntegrationUser.mockResolvedValueOnce(user);
				authUsersServiceMock.create.mockResolvedValueOnce({ id: user.id });

				// Act
				const result = await service.createUser(dto);

				// Assert
				// expect(result).toMatchObject();
				expect(hashServiceMock.hashData).toHaveBeenCalledWith(dto.password);
				expect(authUsersServiceMock.createIntegrationUser).toHaveBeenCalledWith(dto);
				expect(result).toMatchSnapshot({
					id: expect.any(Object),
					email: dto.email,
					hash: hashedPassword,
					hashedRt: null,
					userId: expect.any(Object),
				});
			});
		});

		describe('failure', () => {
			it('should throw CannotCreateUserError if user creation fails', async () => {
				// Arrange
				hashServiceMock.hashData.mockResolvedValueOnce(hashedPassword);
				authUsersServiceMock.createIntegrationUser.mockRejectedValueOnce(new CannotCreateUserError('error'));
				authUsersServiceMock.create.mockRejectedValue(new CannotCreateUserError('error'));

				// Act
				const { error } = await catchActError(() => service.createUser(dto));

				// Assert
				expect(error).toBeInstanceOf(CannotCreateUserError);
				expect(error).toMatchSnapshot();
			});

			it('should throw ConflictError if user with the same email already exists', async () => {
				// Arrange
				const err = { code: 'P2002' };

				hashServiceMock.hashData.mockResolvedValueOnce(hashedPassword);
				authUsersServiceMock.createIntegrationUser.mockRejectedValueOnce(new ConflictError('error'));

				// Act
				const { error } = await catchActError(() => service.createUser(dto));

				// Assert
				expect(error).toBeInstanceOf(ConflictError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('signup', () => {
		const userId = new EntityId('userId');

		beforeEach(() => {
			service.getTokens = jest.fn().mockResolvedValueOnce(tokens);
			service.updateHash = jest.fn().mockResolvedValueOnce(hashedPassword);
		});

		describe('success', () => {
			it('should get tokens, update hash and update user', async () => {
				// Act
				const result = await service.signup(userId);

				// Assert
				expect(result).toEqual(tokens);
				expect(service.getTokens).toHaveBeenCalledWith(userId.value);
				expect(service.updateHash).toHaveBeenCalledWith(tokens.refresh_token);
				expect(authUsersServiceMock.update).toHaveBeenCalledWith({
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
				expect(error!.message).toMatchSnapshot();
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
				authUsersServiceMock.update.mockRejectedValueOnce(err);

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

		beforeEach(() => {
			service.verifyTextToHash = jest.fn().mockResolvedValue(true);
			service.getTokens = jest.fn().mockResolvedValue(tokens);
			service.updateHash = jest.fn().mockResolvedValue(hashedPassword);
			authUsersServiceMock.update.mockResolvedValue(undefined);
		});

		describe('success', () => {
			it('should return signin user and return tokens', async () => {
				// Arrange
				const user = AuthUserFixture.create();

				// Act
				const result = await service.signin(dto, user);

				// Assert
				expect(service.verifyTextToHash).toHaveBeenCalledWith(user.hash, dto.password);
				expect(result).toEqual(tokens);
				expect(service.getTokens).toHaveBeenCalledWith(user.userId.value);
				expect(authUsersServiceMock.update).toHaveBeenCalledWith({
					...user,
					hashedRt: hashedPassword,
				});
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if password is not valid', async () => {
				// Arrange
				const user = AuthUserFixture.create();
				service.verifyTextToHash = jest.fn().mockResolvedValue(false);

				// Act
				const { error } = await catchActError(() => service.signin(dto, user));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getAuthenticatedUserWithEmailAndPassword', () => {
		const user = AuthUserFixture.create();

		beforeEach(() => {
			service.verifyTextToHash = jest.fn().mockResolvedValueOnce(true);
		});

		describe('success', () => {
			it('should return the user if email and password are valid', async () => {
				// Arrange
				authUsersServiceMock.getByUserEmail.mockResolvedValueOnce(user);

				// Act
				const result = await service.getAuthenticatedUserWithEmailAndPassword(user.email, password);

				// Assert
				expect(result).toEqual(user);
				expect(result).toMatchSnapshot({
					...user,
					id: expect.any(Object),
					userId: expect.any(Object),
				});
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				authUsersServiceMock.getByUserEmail.mockResolvedValueOnce(null as any);
				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(user.email, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});

			it('should throw UnauthorizedError if password does not match', async () => {
				// Arrange
				authUsersServiceMock.getByUserEmail.mockResolvedValueOnce(user);
				service.verifyTextToHash = jest.fn().mockResolvedValueOnce(false);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithEmailAndPassword(user.email, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getAuthenticatedUserWithJwt', () => {
		const user = AuthUserFixture.create({
			userId: '74497f9b-1d36-4747-b1f5-9f753a74f163',
		});

		describe('success', () => {
			it('should return the user if userId is valid', async () => {
				// Arrange
				authUsersServiceMock.getByUserId.mockResolvedValueOnce(user);

				// Act
				const result = await service.getAuthenticatedUserWithJwt(user.userId);

				// Assert
				expect(result).toEqual(user);
				expect(authUsersServiceMock.getByUserId).toHaveBeenCalledWith(user.userId);
				expect(result).toMatchSnapshot({
					...user,
					id: expect.any(Object),
					userId: expect.any(Object),
				});
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				authUsersServiceMock.getByUserId.mockResolvedValueOnce(undefined);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithJwt(user.userId));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getAuthenticatedUserWithRefreshToken', () => {
		const user = AuthUserFixture.create();

		describe('success', () => {
			it('should return the user if refreshToken is valid', async () => {
				// Arrange
				authUsersServiceMock.getByUserId.mockResolvedValue(user);
				hashServiceMock.hashAndTextVerify.mockResolvedValueOnce(true);

				// Act
				const result = await service.getAuthenticatedUserWithRefreshToken(user.userId, refreshToken);

				// Assert
				expect(result).toEqual(user);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(user.hashedRt, refreshToken);
				expect(authUsersServiceMock.getByUserId).toHaveBeenCalledWith(user.userId);
				expect(result).toMatchSnapshot({
					...user,
					id: expect.any(Object),
					userId: expect.any(Object),
				});
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if refreshToken is not a string', async () => {
				// Arrange
				authUsersServiceMock.getByUserId.mockResolvedValue(undefined);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithRefreshToken(user.userId, refreshToken));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});

			it('should throw UnauthorizedError if user does not exist', async () => {
				// Arrange
				authUsersServiceMock.getByUserId.mockResolvedValue(user);
				hashServiceMock.hashAndTextVerify.mockResolvedValueOnce(false);

				// Act
				const { error } = await catchActError(() => service.getAuthenticatedUserWithRefreshToken(user.userId, refreshToken));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('logout', () => {
		describe('success', () => {
			it('should call updateUser', async () => {
				// Arrange
				const userId = new EntityId('userId');
				authUsersServiceMock.update.mockResolvedValueOnce(undefined);

				// Act
				await service.logout(userId);

				// Assert
				expect(authUsersServiceMock.update).toHaveBeenCalledWith({
					id: userId,
					hashedRt: null,
				});
			});
		});
	});

	describe('refreshTokens', () => {
		const user = AuthUserFixture.create();

		beforeEach(() => {
			hashServiceMock.hashAndTextVerify.mockResolvedValue(true);
			service.getTokens = jest.fn().mockResolvedValue(tokens);
			service.updateHash = jest.fn().mockResolvedValue(hashedRefreshToken);
			authUsersServiceMock.update.mockResolvedValue(undefined);
		});

		describe('success', () => {
			it('should return new tokens if refreshToken is valid', async () => {
				// Act
				const result = await service.refreshTokens(user, refreshToken);

				// Assert
				expect(result).toEqual(tokens);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(user.hashedRt, refreshToken);
				expect(service.getTokens).toHaveBeenCalledWith(user.userId.value);
				expect(service.updateHash).toHaveBeenCalledWith(tokens.refresh_token);
				expect(authUsersServiceMock.update).toHaveBeenCalledWith({ ...user, hashedRt: hashedRefreshToken });
				expect(result).toMatchSnapshot();
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if refreshToken does not match user.hashedRt', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValue(false);

				// Act
				const { error } = await catchActError(() => service.refreshTokens(user, refreshToken));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('verifyTextToHash', () => {
		describe('success', () => {
			it('should return true if password matches hash', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValue(true);
				// Act
				const result = await service.verifyTextToHash(hashedPassword, password);
				// Assert
				expect(result).toBe(true);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(hashedPassword, password);
			});
		});

		describe('failure', () => {
			it('should throw UnauthorizedError if hashAndTextVerify doesnt return bool', async () => {
				// Arrange
				hashServiceMock.hashAndTextVerify.mockResolvedValueOnce(5 as unknown as boolean);
				// Act
				const { error } = await catchActError(() => service.verifyTextToHash(hashedPassword, password));

				// Assert
				expect(error).toBeInstanceOf(UnauthorizedError);
				expect(hashServiceMock.hashAndTextVerify).toHaveBeenCalledWith(hashedPassword, password);
				expect(error).toMatchSnapshot();
			});
		});
	});

	describe('getTokens', () => {
		describe('success', () => {
			it('should return tokens', async () => {
				// Arrange
				const userId = new EntityId('userId');
				jwtServiceMock.signAsync.mockResolvedValueOnce(Promise.resolve(tokens.access_token));
				jwtServiceMock.signAsync.mockResolvedValueOnce(Promise.resolve(tokens.refresh_token));

				// Act
				const result = await service.getTokens(userId.value);

				// Assert
				expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
					{
						id: userId.value,
					},
					{
						secret: expect.any(String),
						expiresIn: expect.any(String),
					},
				);
				expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
					{
						id: userId.value,
					},
					{
						secret: expect.any(String),
						expiresIn: expect.any(String),
					},
				);
				expect(result).toEqual(tokens);
				expect(result).toMatchSnapshot();
			});
		});
	});

	describe('updateHash', () => {
		describe('success', () => {
			it('should call updateUser', async () => {
				// Arrange
				const text = 'some-text';
				const updatedText = 'uptadet-some-text';
				hashServiceMock.hashData.mockResolvedValueOnce(updatedText);

				// Act
				const result = await service.updateHash(text);

				// Assert
				expect(hashServiceMock.hashData).toHaveBeenCalledWith(text);
				expect(result).toEqual(updatedText);
				expect(result).toMatchSnapshot();
			});
		});
	});

	describe('isCorrectString', () => {
		describe('failure', () => {
			it.each([{ input: null }, { input: undefined }, { input: {} }, { input: 0 }, { input: NaN }, { input: '' }, { input: '    ' }])(
				'should throw UnauthorizedError if password is: $input',
				async ({ input }) => {
					// Act
					const { error } = catchActError(() => service.isCorrectString(input as string));
					// Assert
					expect(error).toBeInstanceOf(UnauthorizedError);
				},
			);
		});
	});
});
