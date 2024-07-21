import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';

import { IOutboxRepository } from '@app/core';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';

import { ISkillsCommandRepository, SkillAlreadyExistsError, SkillEntityFixtureFactory } from '../../domain';
import { CreateSkillCommand } from './create-skill.command';
import { CreateSkillHandler } from './create-skill.handler';

jest.mock('@nestjs-cls/transactional', () => ({
  Transactional: () => jest.fn(),
}));

describe('CreateSkillHandler', () => {
  let handler: CreateSkillHandler;
  let skillCommandRepositoryMock: jest.Mocked<ISkillsCommandRepository>;
  let outboxRepositoryMock: jest.Mocked<IOutboxRepository>;

  beforeEach(async () => {
    skillCommandRepositoryMock = createMock();
    outboxRepositoryMock = createMock();

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
      ],
    }).compile();

    handler = app.get(CreateSkillHandler);
  });

  const name = 'test';
  const context = 'test-context';
  const id = 1;
  const command = new CreateSkillCommand({
    name,
    context,
  });

  const entity = SkillEntityFixtureFactory.create();

  describe('Success', () => {
    it('should create new skill', async () => {
      // Arrange
      skillCommandRepositoryMock.getOneByNameAndContext.mockResolvedValueOnce(undefined);
      skillCommandRepositoryMock.save.mockResolvedValueOnce({ id });

      // Act
      const result = await handler.execute(command);

      // Assert

      expect(skillCommandRepositoryMock.save).toHaveBeenCalledWith({
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
    it('should throw SkillAlreadyExistsError', async () => {
      // Arrange
      skillCommandRepositoryMock.getOneByNameAndContext.mockResolvedValueOnce(entity);

      // Act
      const { error } = await catchActError(() => handler.execute(command));

      // Assert

      expect(skillCommandRepositoryMock.save).toHaveBeenCalledTimes(0);
      expect(outboxRepositoryMock.store).toHaveBeenCalledTimes(0);
      expect(error).toBeInstanceOf(SkillAlreadyExistsError);
      expect(error).toMatchSnapshot();
    });
  });
});
