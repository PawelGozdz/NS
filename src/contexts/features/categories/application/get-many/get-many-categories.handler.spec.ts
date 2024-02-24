import { createMock } from '@golevelup/ts-jest';
import { Test } from '@nestjs/testing';
import { PinoLogger } from 'nestjs-pino';

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

	const query: GetManyCategoriesQuery = {
		_filter: {
			name: 'it',
		},
	};

	const categories: CategoryInfo[] = [
		{
			id: 2,
			name: 'name',
			description: 'description',
			ctx: 'ctx',
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
