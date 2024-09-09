/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { Actor } from '@app/core';
import { ActorType } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import {
  IJobUserProfileCommandRepository,
  JobUserProfile,
  JobUserProfileAggregateRootFixtureFactory,
  JobUserProfileAlreadyExistsError,
} from '../../domain';
import { CreateJobUserProfileCommand } from './create-job-user-profile.command';
import { CreateJobUserProfileHandler } from './create-job-user-profile.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('CreateJobUserProfileHandler', () => {
  let handler: CreateJobUserProfileHandler;
  let commandRepositoryMock: jest.Mocked<IJobUserProfileCommandRepository>;

  beforeEach(async () => {
    commandRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        CreateJobUserProfileHandler,
        {
          provide: IJobUserProfileCommandRepository,
          useValue: commandRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(CreateJobUserProfileHandler);
  });

  const actor = Actor.create(ActorType.USER, CreateJobUserProfileHandler.name, 'c8aa6154-dba2-466c-8858-64c755e71ff0');

  const command = new CreateJobUserProfileCommand({
    bio: 'bio',
    salaryRange: {
      from: 1000,
      to: 2000,
    },
    userId: '34d90467-aeb4-4016-9791-86f9aec010e4',
    certificates: [
      {
        completionYear: 2024,
        institution: 'institution',
        name: 'name',
      },
    ],
    actor,
  });

  const user = JobUserProfileAggregateRootFixtureFactory.create();

  describe('Success', () => {
    it('should create new user', async () => {
      // Arrange
      commandRepositoryMock.getOneByUserId.mockResolvedValueOnce(undefined);
      let savedUserProfile!: JobUserProfile;
      commandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        savedUserProfile = aggregate;
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(commandRepositoryMock.save).toHaveBeenCalledWith(savedUserProfile);
      expect(result).toStrictEqual({ id: expect.any(String) });
    });
  });

  describe('failure', () => {
    it('should throw JobUserProfileAlreadyExistsError', async () => {
      // Arrange
      commandRepositoryMock.getOneByUserId.mockResolvedValueOnce(user);
      let savedUserProfile: JobUserProfile;
      commandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        savedUserProfile = aggregate;
      });

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(commandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobUserProfileAlreadyExistsError);
    });
  });
});
