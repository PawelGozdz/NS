/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createMock } from '@golevelup/ts-jest';
import { QueryBus } from '@nestjs/cqrs';
import { Test } from '@nestjs/testing';

import { Actor, AppContext, IOutboxRepository } from '@app/core';
import { ActorType, EntityId } from '@libs/common';
import { QueryBusMock, TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { IJobPositionCommandRepository, JobPositionAlreadyExistsError, JobPositionEntityFixtureFactory, JobPositionUpdatedEvent } from '../../domain';
import { JobPositionIncorrectIdsError } from '../../domain/job-position/errors/job-position-incorrect-skill-ids.error';
import { GetManySkillsQuery } from '../skills-get-many/get-many-skills.query';
import { UpdateJobPositionCommand } from './update-job-position.command';
import { UpdateJobPositionHandler } from './update-job-position.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('UpdateJobPositionHandler', () => {
  let handler: UpdateJobPositionHandler;
  let commandRepositoryMock: jest.Mocked<IJobPositionCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;
  let queryBusMock: QueryBusMock;

  beforeEach(async () => {
    commandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        UpdateJobPositionHandler,
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

    handler = app.get(UpdateJobPositionHandler);
    queryBusMock = app.get(QueryBus);
  });

  const actor = Actor.create(ActorType.USER, UpdateJobPositionHandler.name, 'c8aa6154-dba2-466c-8858-64c755e71ff0');

  const command = new UpdateJobPositionCommand({
    id: 'c8aa6154-dba2-466c-8858-64c755e71ff0',
    skillIds: [1, 2],
    actor,
  });

  const categoryIdExisting = 1;
  const newTitle = 'New Title';
  const oldTitle = 'Old Title';

  const entity = JobPositionEntityFixtureFactory.create({
    ...command,
    title: oldTitle,
    id: undefined,
  });

  const entityExisting = JobPositionEntityFixtureFactory.create({
    ...command,
    id: EntityId.create('c8aa6154-dba2-466c-8858-64c755e71f11'),
    categoryId: categoryIdExisting,
  });

  const skills = [{ id: 1 }, { id: 2 }] as unknown as GetManySkillsQuery;

  describe('Success', () => {
    it('should update new job position', async () => {
      // Arrange
      commandRepositoryMock.getOneById.mockResolvedValueOnce(entity);
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(undefined);
      queryBusMock.execute.mockResolvedValueOnce(skills);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(commandRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: expect.any(String) });
      expect(outboxRepositoryMock.store).toHaveBeenNthCalledWith(1, {
        context: AppContext.JOBS,
        eventName: JobPositionUpdatedEvent.name,
        data: new JobPositionUpdatedEvent({
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

    it('should update new job position with categoryId', async () => {
      // Arrange
      commandRepositoryMock.getOneById.mockResolvedValueOnce(entity);
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(undefined);
      queryBusMock.execute.mockResolvedValueOnce(skills);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(commandRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: expect.any(String) });
      expect(outboxRepositoryMock.store).toHaveBeenNthCalledWith(1, {
        context: AppContext.JOBS,
        eventName: JobPositionUpdatedEvent.name,
        data: new JobPositionUpdatedEvent({
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
    it('should throw JobPositionAlreadyExistsError', async () => {
      // Arrange
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(entity);

      // Act
      const { error } = await catchActError(() =>
        handler.execute({
          ...command,
          title: newTitle,
        }),
      );

      // Assert

      expect(commandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobPositionAlreadyExistsError);
    });

    it('should throw JobPositionIncorrectIdsError', async () => {
      // Arrange
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(undefined);
      queryBusMock.execute.mockResolvedValueOnce([skills[0]]);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(commandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobPositionIncorrectIdsError);
    });

    it('should throw JobPositionAlreadyExistsError when try to use taken slug+categoryId', async () => {
      // Arrange
      commandRepositoryMock.getOneById.mockResolvedValueOnce(entity);
      commandRepositoryMock.getOneByCategoryIdAndSlug.mockResolvedValueOnce(entityExisting);

      // Act
      const { error } = await catchActError(() =>
        handler.execute({
          ...command,
          categoryId: categoryIdExisting,
        }),
      );

      // Assert
      expect(commandRepositoryMock.update).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(JobPositionAlreadyExistsError);
      expect(error?.message).toEqual('Entity with title old-title and categoryId 1 already exists');
    });
  });
});
