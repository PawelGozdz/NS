import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { ActorType, IActor } from '@libs/common';

import { ISkillsQueryRepository, SkillInfo } from '../../domain';
import { GetManySkillsHandler } from './get-many-skills.handler';
import { GetManySkillsQuery } from './get-many-skills.query';

describe('GetManySkillsHandler', () => {
  let handler: GetManySkillsHandler;
  let skillQueryRepositoryMock: jest.Mocked<ISkillsQueryRepository>;

  beforeEach(async () => {
    skillQueryRepositoryMock = createMock<ISkillsQueryRepository>();

    const app = await Test.createTestingModule({
      providers: [
        GetManySkillsHandler,
        {
          provide: ISkillsQueryRepository,
          useValue: skillQueryRepositoryMock,
        },
        {
          provide: PinoLogger,
          useValue: createMock<PinoLogger>(),
        },
      ],
    }).compile();

    handler = app.get(GetManySkillsHandler);
  });

  const actor: IActor = {
    type: ActorType.SYSTEM,
    source: 'source',
  };

  const query: GetManySkillsQuery = {
    _filter: {
      name: 'it',
    },
    actor,
  };

  const categoryId = 2;

  const skills: SkillInfo[] = [
    {
      id: 2,
      name: 'name',
      description: 'description',
      categoryId,
    },
  ];

  it('should get many skills', async () => {
    // Arrange
    skillQueryRepositoryMock.getManyBy.mockResolvedValueOnce(skills);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.length).toBe(1);
    expect(result).toMatchSnapshot();
  });
});
