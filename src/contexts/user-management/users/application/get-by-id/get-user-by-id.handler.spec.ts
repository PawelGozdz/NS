import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IUsersQueryRepository, UserInfo, UserNotFoundError } from '../../domain';
import { GetUserByIdHandler } from './get-user-by-id.handler';
import { GetUserByIdQuery } from './get-user-by-id.query';

describe('GetUserByIdQuery', () => {
  let userQueryRepositoryMock: jest.Mocked<IUsersQueryRepository>;
  let handler: GetUserByIdHandler;

  const userId = '5da438e4-1c03-4008-8906-7ab5de7a877f';

  const query = new GetUserByIdQuery({ userId });
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
        GetUserByIdHandler,
        {
          provide: IUsersQueryRepository,
          useValue: userQueryRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(GetUserByIdHandler);
  });

  describe('Success', () => {
    it('should return user', async () => {
      userQueryRepositoryMock.getOneById.mockResolvedValueOnce(userInfo);

      const result = await handler.execute(query);

      expect(result).toEqual(userInfo);
    });
  });

  describe('Failure', () => {
    it('should throw an error when user does not exist', async () => {
      userQueryRepositoryMock.getOneById.mockResolvedValueOnce(undefined);

      const { error } = await catchActError(async () => {
        await handler.execute(query);
      });

      expect(error).toBeInstanceOf(UserNotFoundError);
    });
  });
});
