import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IUsersQueryRepository, UserInfo, UserNotFoundError } from '../../domain';
import { GetUserByEmailHandler } from './get-user-by-email.handler';
import { GetUserByEmailQuery } from './get-user-by-email.query';

describe('GetUserByIdQuery', () => {
  let userQueryRepositoryMock: jest.Mocked<IUsersQueryRepository>;
  let handler: GetUserByEmailHandler;

  const userEmail = 'test5@gmail.com';

  const query = new GetUserByEmailQuery({ email: userEmail });
  const userInfo: UserInfo = {
    id: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
    email: 'test@test.com',
    profile: {
      id: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
      userId: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
      firstName: 'test',
      lastName: 'test',
      username: 'some-name',
      address: null,
      bio: null,
      gender: null,
      dateOfBirth: null,
      hobbies: [],
      languages: [],
      phoneNumber: null,
      profilePicture: null,
      rodoAcceptanceDate: null,
    },
  };

  beforeEach(async () => {
    userQueryRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        GetUserByEmailHandler,
        {
          provide: IUsersQueryRepository,
          useValue: userQueryRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(GetUserByEmailHandler);
  });

  describe('Success', () => {
    it('should return user', async () => {
      userQueryRepositoryMock.getOneByEmail.mockResolvedValueOnce(userInfo);

      const result = await handler.execute(query);

      expect(result).toEqual(userInfo);
    });
  });

  describe('Failure', () => {
    it('should throw an error when user does not exist', async () => {
      userQueryRepositoryMock.getOneByEmail.mockResolvedValueOnce(undefined);

      const { error } = await catchActError(async () => {
        await handler.execute(query);
      });

      expect(error).toBeInstanceOf(UserNotFoundError);
    });
  });
});
