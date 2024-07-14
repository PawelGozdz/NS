import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { IOutboxRepository } from '@app/core';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { CategoryAlreadyExistsError, CategoryEntityFixtureFactory, ICategoriesCommandRepository } from '../../domain';
import { CreateCategoryCommand } from './create-category.command';
import { CreateCategoryHandler } from './create-category.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('CreateCategoryHandler', () => {
  let handler: CreateCategoryHandler;
  let categoryCommandRepositoryMock: jest.Mocked<ICategoriesCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;

  beforeEach(async () => {
    categoryCommandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        CreateCategoryHandler,
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

    handler = app.get(CreateCategoryHandler);
  });

  const name = 'test';
  const context = 'test-context';
  const id = 1;
  const command = new CreateCategoryCommand({
    name,
    context,
  });

  const categoryEntity = CategoryEntityFixtureFactory.create();

  describe('Success', () => {
    it('should create new category', async () => {
      // Arrange
      categoryCommandRepositoryMock.getOneByNameAndContext.mockResolvedValueOnce(undefined);
      categoryCommandRepositoryMock.save.mockResolvedValueOnce({ id });

      // Act
      const result = await handler.execute(command);

      // Assert

      expect(categoryCommandRepositoryMock.save).toHaveBeenCalledWith({
        name,
        context,
        description: undefined,
        parentId: undefined,
      });
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(1);
      expect(result).toMatchSnapshot();
    });
  });

  describe('failure', () => {
    it('should throw CategoryAlreadyExistsError', async () => {
      // Arrange
      categoryCommandRepositoryMock.getOneByNameAndContext.mockResolvedValueOnce(categoryEntity);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(categoryCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(CategoryAlreadyExistsError);
      expect(error).toMatchSnapshot();
    });
  });
});
