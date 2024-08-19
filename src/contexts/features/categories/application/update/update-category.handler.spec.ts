import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { Actor, IOutboxRepository } from '@app/core';
import { ActorType } from '@libs/common';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { CategoryEntityFixtureFactory, CategoryNotFoundError, ICategoriesCommandRepository } from '../../domain';
import { UpdateCategoryCommand } from './update-category.command';
import { UpdateCategoryHandler } from './update-category.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('UpdateCategoryHandler', () => {
  let handler: UpdateCategoryHandler;
  let categoryCommandRepositoryMock: jest.Mocked<ICategoriesCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;

  beforeEach(async () => {
    categoryCommandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        UpdateCategoryHandler,
        {
          provide: ICategoriesCommandRepository,
          useValue: categoryCommandRepositoryMock,
        },
        {
          provide: IOutboxRepository,
          useValue: outboxRepositoryMock,
        },
      ],
    }).compile();

    handler = app.get(UpdateCategoryHandler);
  });

  const actor = Actor.create(ActorType.SYSTEM, UpdateCategoryHandler.name);
  const name = 'test';
  const id = 1;
  const newName = 'new-name';
  const command = new UpdateCategoryCommand({
    name: newName,
    id,
    description: null,
    actor,
  });

  const categoryEntity = CategoryEntityFixtureFactory.create({
    id,
    name,
    description: 'some desc',
  });

  describe('Success', () => {
    it('should update new category', async () => {
      // Arrange
      categoryCommandRepositoryMock.getOneById.mockResolvedValueOnce(categoryEntity);

      // Act
      await handler.execute(command);

      // Assert

      expect(categoryCommandRepositoryMock.update).toHaveBeenCalledWith({
        id,
        name: newName,
        description: null,
        parentId: null,
      });
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(1);
    });
  });

  describe('failure', () => {
    it('should throw CategoryNotFoundError', async () => {
      // Arrange
      categoryCommandRepositoryMock.getOneById.mockResolvedValueOnce(undefined);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(categoryCommandRepositoryMock.update).toHaveBeenCalledTimes(0);
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(CategoryNotFoundError);
      expect(error).toMatchSnapshot();
    });
  });
});
