import { createMock } from '@golevelup/ts-jest';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';

import { TestLoggerModule } from '@libs/testing';

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
      authUsersRepositoryMock.update.mockResolvedValue(undefined);

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
      authUsersRepositoryMock.delete.mockResolvedValue(undefined);

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
});
