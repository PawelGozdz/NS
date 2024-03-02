/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IUsersCommandRepository, User, UserAggregateRootFixtureFactory, UserAlreadyExistsError } from '../../domain';
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
    email: 'test@test.com',
  });

  const user = UserAggregateRootFixtureFactory.create();

  describe('Success', () => {
    it('should create new user', async () => {
      // Arrange
      userCommandRepositoryMock.getOneByEmail.mockResolvedValueOnce(undefined);
      let saveduser: User;
      userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        saveduser = aggregate;
      });

      // Act
      const result = await handler.execute(command);

      // Assert

      expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(saveduser!);
      // expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(expect.any(User));
      expect(result).toStrictEqual({ id: expect.any(String) });
    });
  });

  describe('failure', () => {
    it('should throw UserAlreadyExistsError', async () => {
      // Arrange
      userCommandRepositoryMock.getOneByEmail.mockResolvedValueOnce(user);
      let saveduser: User;
      userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        saveduser = aggregate;
      });

      // Act
      // const result = await handler.execute(command);
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(userCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(UserAlreadyExistsError);
    });
  });
});
