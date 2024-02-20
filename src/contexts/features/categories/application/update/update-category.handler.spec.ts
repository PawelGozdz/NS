import { createMock } from '@golevelup/ts-jest';
import { TestCqrsModule, TestLoggerModule, catchActError } from '@libs/testing';
import { Test } from '@nestjs/testing';
import { CategoryEntityFixtureFactory, CategoryNotFoundError, ICategoriesCommandRepository } from '../../domain';
import { UpdateCategoryCommand } from './update-category.command';
import { UpdateCategoryHandler } from './update-category.handler';

describe('UpdateCategoryHandler', () => {
	let handler: UpdateCategoryHandler;
	let categoryCommandRepositoryMock: jest.Mocked<ICategoriesCommandRepository>;

	beforeEach(async () => {
		categoryCommandRepositoryMock = createMock();

		const app = await Test.createTestingModule({
			imports: [TestLoggerModule.forRoot(), TestCqrsModule],
			providers: [
				UpdateCategoryHandler,
				{
					provide: ICategoriesCommandRepository,
					useValue: categoryCommandRepositoryMock,
				},
			],
		}).compile();

		handler = app.get(UpdateCategoryHandler);
	});

	const name = 'test';
	const ctx = 'test-ctx';
	const id = 1;
	const newName = 'new-name';
	const command = new UpdateCategoryCommand({
		name: newName,
		ctx,
		id,
		description: null,
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
				ctx,
				description: null,
				parentId: null,
			});
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
			expect(error).toBeInstanceOf(CategoryNotFoundError);
			expect(error).toMatchSnapshot();
		});
	});
});
