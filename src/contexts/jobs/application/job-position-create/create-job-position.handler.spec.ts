/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { Actor, AppContext, IOutboxRepository } from '@app/core';
import { ActorType, EntityId } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IJobPositionCommandRepository, JobPositionAlreadyExistsError, JobPositionCreatedEvent, JobPositionEntityFixtureFactory } from '../../domain';
import { CreateJobPositionCommand } from './create-job-position.command';
import { CreateJobPositionHandler } from './create-job-position.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('CreateJobPositionHandler', () => {
  let handler: CreateJobPositionHandler;
  let commandRepositoryMock: jest.Mocked<IJobPositionCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;

  beforeEach(async () => {
    commandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        CreateJobPositionHandler,
        {
          provide: IJobPositionCommandRepository,
          useValue: commandRepositoryMock,
        },
        {
          provide: IOutboxRepository,
          useValue: outboxRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(CreateJobPositionHandler);
  });

  const actor = Actor.create(ActorType.USER, CreateJobPositionHandler.name, 'c8aa6154-dba2-466c-8858-64c755e71ff0');

  const command = new CreateJobPositionCommand({
    categoryId: 1,
    skillIds: [1, 2],
    title: 'My title',
    actor,
  });

  const entity = JobPositionEntityFixtureFactory.create({
    ...command,
    id: undefined,
  });

  describe('Success', () => {
    it('should create new job position', async () => {
      // Arrange
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(commandRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: expect.any(String) });
      expect(outboxRepositoryMock.store).toHaveBeenNthCalledWith(1, {
        context: AppContext.JOBS,
        eventName: JobPositionCreatedEvent.name,
        data: new JobPositionCreatedEvent({
          title: entity.title,
          slug: entity.slug,
          categoryId: entity.categoryId,
          skillIds: entity.skillIds,
          id: EntityId.create(result.id),
          actor,
        }),
        actor,
      });
    });
  });

  describe('failure', () => {
    it('should throw JobUserProfileAlreadyExistsError', async () => {
      // Arrange
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(entity);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(commandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobPositionAlreadyExistsError);
    });
  });
});
