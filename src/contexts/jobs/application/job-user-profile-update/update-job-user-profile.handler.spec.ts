/* eslint-disable @typescript-eslint/no-unused-vars */
import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { Actor } from '@app/core';
import { ActorType, EntityId } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import {
  IJobUserProfileCommandRepository,
  JobUserProfile,
  JobUserProfileAggregateRootFixtureFactory,
  JobUserProfileNotFoundError,
  JobUserProfileUpdatedEvent,
} from '../../domain';
import { UpdateJobUserProfileCommand } from './update-job-user-profile.command';
import { UpdateJobUserProfileHandler } from './update-job-user-profile.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('UpdateJobUserProfileHandler', () => {
  let handler: UpdateJobUserProfileHandler;
  let userCommandRepositoryMock: jest.Mocked<IJobUserProfileCommandRepository>;

  beforeEach(async () => {
    userCommandRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        UpdateJobUserProfileHandler,
        {
          provide: IJobUserProfileCommandRepository,
          useValue: userCommandRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(UpdateJobUserProfileHandler);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const actor = Actor.create(ActorType.USER, UpdateJobUserProfileCommand.name, '34d90467-aeb4-4016-9791-86f9aec010e0');

  const id = new EntityId('34d90467-aeb4-4016-9791-86f9aec010e4');
  const command = new UpdateJobUserProfileCommand({
    id: id.value,
    bio: 'bio',
    salaryRange: {
      from: 1000,
      to: 2000,
    },
    actor,
  });

  const user = JobUserProfileAggregateRootFixtureFactory.create({
    id: id.value,
  });

  describe('Success', () => {
    it('should update new profile', async () => {
      // Arrange
      let copyUser: JobUserProfile;
      const newBio = 'newBio';
      userCommandRepositoryMock.getOneById.mockResolvedValueOnce(user);

      userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        copyUser = aggregate;
      });

      // Act
      await handler.execute({
        ...command,
        bio: newBio,
        salaryRange: {
          from: 3000,
          to: 5000,
        },
      });

      // Assert
      const events = user.getUncommittedEvents();

      expect(events.length).toBe(1);
      expect(events[0]).toBeInstanceOf(JobUserProfileUpdatedEvent);
      expect(userCommandRepositoryMock.save).toHaveBeenCalledWith(user);
    });
  });

  describe('Failure', () => {
    it('should throw JobUserProfileNotFoundError', async () => {
      // Arrange
      let copyUser: JobUserProfile;
      userCommandRepositoryMock.getOneById.mockResolvedValueOnce(undefined);
      userCommandRepositoryMock.save.mockImplementationOnce(async (aggregate) => {
        copyUser = aggregate;
      });

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert
      expect(userCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobUserProfileNotFoundError);
    });
  });
});
