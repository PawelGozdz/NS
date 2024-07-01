import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { TestCqrsModule, TestLoggerModule } from '@libs/testing';

import { IUsersQueryRepository, UserInfo } from '../../domain';
import { GetUsersHandler } from './get-users.handler';
import { GetUsersQuery } from './get-users.query';

describe('GetUsersQuery', () => {
  let userQueryRepositoryMock: jest.Mocked<IUsersQueryRepository>;
  let handler: GetUsersHandler;

  const query = new GetUsersQuery({});
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
        GetUsersHandler,
        {
          provide: IUsersQueryRepository,
          useValue: userQueryRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(GetUsersHandler);
  });

  describe('Success', () => {
    it('should return users', async () => {
      // Arrange
      userQueryRepositoryMock.getMany.mockResolvedValueOnce([userInfo]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toEqual([userInfo]);
    });

    it('should return empty array when users not exist', async () => {
      // Arrange
      userQueryRepositoryMock.getMany.mockResolvedValueOnce([]);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
