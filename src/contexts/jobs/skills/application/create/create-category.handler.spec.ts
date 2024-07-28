import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { IOutboxRepository } from '@app/core';
import { QueryBus } from '@libs/cqrs';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { ISkillsCommandRepository, SkillAlreadyExistsError, SkillEntityFixtureFactory, SkillNotFoundError } from '../../domain';
import { CreateSkillCommand } from './create-skill.command';
import { CreateSkillHandler } from './create-skill.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('CreateSkillHandler', () => {
  let handler: CreateSkillHandler;
  let skillCommandRepositoryMock: jest.Mocked<ISkillsCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;
  let queryBusMock: jest.Mocked<QueryBus>;

  beforeEach(async () => {
    skillCommandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();
    queryBusMock = createMock();

    const app = await Test.createTestingModule({
      imports: [TestLoggerModule.forRoot(), TestCqrsModule],
      providers: [
        CreateSkillHandler,
        {
          provide: ISkillsCommandRepository,
          useValue: skillCommandRepositoryMock,
        },
        {
          provide: IOutboxRepository,
          useValue: outboxRepositoryMock,
        },
        {
          provide: QueryBus,
          useValue: queryBusMock,
        },
      ],
    }).compile();

    handler = app.get(CreateSkillHandler);
  });

  const categoryId = 5;
  const name = 'test';
  const id = 1;
  const command = new CreateSkillCommand({
    name,
    categoryId,
  });

  const category = { id: categoryId };

  const entity = SkillEntityFixtureFactory.create();

  describe('Success', () => {
    it('should create new skill', async () => {
      // Arrange
      skillCommandRepositoryMock.getOneByNameAndCategoryId.mockResolvedValueOnce(undefined);
      queryBusMock.execute.mockResolvedValueOnce(category);
      skillCommandRepositoryMock.save.mockResolvedValueOnce({ id });

      // Act
      const result = await handler.execute(command);

      // Assert

      expect(skillCommandRepositoryMock.save).toHaveBeenCalledWith({
        name,
        description: undefined,
        categoryId,
      });
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(1);
      expect(result).toMatchSnapshot();
    });
  });

  describe('failure', () => {
    it('should throw SkillAlreadyExistsError', async () => {
      // Arrange
      skillCommandRepositoryMock.getOneByNameAndCategoryId.mockResolvedValueOnce(entity);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(skillCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(SkillAlreadyExistsError);
      expect(error).toMatchSnapshot();
    });

    it('should throw SkillNotFoundError', async () => {
      // Arrange
      skillCommandRepositoryMock.getOneByNameAndCategoryId.mockResolvedValueOnce(undefined);
      queryBusMock.execute.mockResolvedValueOnce([]);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(skillCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(SkillNotFoundError);
      expect(error).toMatchSnapshot();
    });
  });
});
