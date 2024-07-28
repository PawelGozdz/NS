import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

import { Actor } from '@app/core';
import { ActorType } from '@libs/common';

import { CategoryInfo, ICategoriesQueryRepository } from '../../domain';
import { GetManyCategoriesHandler } from './get-many-categories.handler';
import { GetManyCategoriesQuery } from './get-many-categories.query';

describe('GetManyCategoriesHandler', () => {
  let handler: GetManyCategoriesHandler;
  let categoryQueryRepositoryMock: jest.Mocked<ICategoriesQueryRepository>;

  beforeEach(async () => {
    categoryQueryRepositoryMock = createMock<ICategoriesQueryRepository>();

    const app = await Test.createTestingModule({
      providers: [
        GetManyCategoriesHandler,
        {
          provide: ICategoriesQueryRepository,
          useValue: categoryQueryRepositoryMock,
        },
        {
          provide: PinoLogger,
          useValue: createMock<PinoLogger>(),
        },
      ],
    }).compile();

    handler = app.get(GetManyCategoriesHandler);
  });

  const actor = Actor.create(ActorType.GUEST, GetManyCategoriesHandler.name, 'c8aa6154-dba2-466c-8858-64c755e71ff1');

  const query: GetManyCategoriesQuery = {
    _filter: {
      name: 'it',
    },
    actor,
  };

  const categories: CategoryInfo[] = [
    {
      id: 2,
      name: 'name',
      description: 'description',
      parentId: 1,
    },
  ];

  it('should get many categories', async () => {
    // Arrange
    categoryQueryRepositoryMock.getManyBy.mockResolvedValueOnce(categories);

    // Act
    const result = await handler.execute(query);

    // Assert
    expect(result.length).toBe(1);
    expect(result).toMatchSnapshot();
  });
});
