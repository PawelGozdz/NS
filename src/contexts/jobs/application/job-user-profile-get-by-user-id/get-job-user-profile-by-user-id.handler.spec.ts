import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { Actor } from '@app/core';
import { ActorType } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IJobUserProfileQueryRepository, JobUserProfileInfo, JobUserProfileNotFoundError } from '../../domain';
import { GetJobUserProfileByUserIdIdHandler } from './get-job-user-profile-by-user-id.handler';
import { GetJobUserProfileByUserIdQuery } from './get-job-user-profile-by-user-id.query';

describe('GetJobUserProfileByUserIdQuery', () => {
  let userQueryRepositoryMock: jest.Mocked<IJobUserProfileQueryRepository>;
  let handler: GetJobUserProfileByUserIdIdHandler;

  const userId = '5da438e4-1c03-4008-8906-7ab5de7a877f';

  const actor = Actor.create(ActorType.USER, GetJobUserProfileByUserIdQuery.name, 'c8aa6154-dba2-466c-8858-64c755e71ff0');

  const query = new GetJobUserProfileByUserIdQuery({ userId, actor });

  const userInfo: JobUserProfileInfo = {
    id: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
    userId: 'c8aa6154-dba2-466c-8858-64c755e71ff6',
    bio: null,
    salaryRange: {
      from: 1000,
      to: 2000,
    },
    jobs: ['c8aa6154-dba2-466c-8858-64c755e71ff1'],
    jobPositions: ['c8aa6154-dba2-466c-8858-64c755e71ff2'],
    experience: [
      {
        id: 'c8aa6154-dba2-466c-8858-64c755e71ff3',
        startDate: new Date(),
        endDate: new Date(),
        experienceInMonths: 12,
      },
    ],
    education: [
      {
        degree: 'Bachelor',
        institution: 'University',
        graduateYear: 2010,
      },
    ],
    certificates: [
      {
        name: 'Certificate',
        institution: 'Institution',
        completionYear: 2010,
      },
    ],
  };

  beforeEach(async () => {
    userQueryRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        GetJobUserProfileByUserIdIdHandler,
        {
          provide: IJobUserProfileQueryRepository,
          useValue: userQueryRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(GetJobUserProfileByUserIdIdHandler);
  });

  describe('Success', () => {
    it('should return user', async () => {
      userQueryRepositoryMock.getOneByUserId.mockResolvedValueOnce(userInfo);

      const result = await handler.execute(query);

      expect(result).toEqual(userInfo);
    });
  });

  describe('Failure', () => {
    it('should throw JobUserProfileNotFoundError', async () => {
      userQueryRepositoryMock.getOneByUserId.mockResolvedValueOnce(undefined);

      const { error } = await catchActError(async () => {
        await handler.execute(query);
      });

      expect(error).toBeInstanceOf(JobUserProfileNotFoundError);
    });
  });
});
