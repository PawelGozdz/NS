import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { ActorType, IActor } from '@libs/common';

import { IJobPositionQueryRepository, JobPositionInfo } from '../../domain';
import { GetManyJobPositionsHandler } from './get-many-job-positions.handler';
import { GetManyJobPositionsQuery } from './get-many-job-positions.query';

describe('GetManyJobPositionsHandler', () => {
  let handler: GetManyJobPositionsHandler;
  let queryRepositoryMock: jest.Mocked<IJobPositionQueryRepository>;

  beforeEach(async () => {
    queryRepositoryMock = createMock<IJobPositionQueryRepository>();

    const app = await Test.createTestingModule({
      providers: [
        GetManyJobPositionsHandler,
        {
          provide: IJobPositionQueryRepository,
          useValue: queryRepositoryMock,
        },
        {
          provide: PinoLogger,
          useValue: createMock<PinoLogger>(),
        },
      ],
    }).compile();

    handler = app.get(GetManyJobPositionsHandler);
  });

  const actor: IActor = {
    type: ActorType.SYSTEM,
    source: 'source',
  };

  const query: GetManyJobPositionsQuery = {
    _filter: {
      title: 'it',
    },
    actor,
  };

  const categories: JobPositionInfo[] = [
    {
      id: 'position-id',
      title: 'Backend Developer',
      slug: 'backend-developser',
      skillIds: [],
      categoryId: 2,
    },
  ];

  it('should get many job positions', async () => {
    // Arrange
    queryRepositoryMock.getManyBy.mockResolvedValueOnce(categories);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.length).toBe(1);
    expect(result).toMatchSnapshot();
  });
});
