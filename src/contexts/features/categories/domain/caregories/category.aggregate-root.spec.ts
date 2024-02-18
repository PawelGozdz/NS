import { Category } from './category.aggregate-root';
import { CategoryAggregateRootFixtureFactory } from './category.aggregate-root.fixture';
import { CategoryCreatedEvent, CategoryUpdatedEvent } from './events';

describe('Category', () => {
	afterEach(() => {
		jest.resetModules();
		jest.restoreAllMocks();
	});

	const category = CategoryAggregateRootFixtureFactory.create();

	describe('create', () => {
		describe('Success', () => {
			it('should apply CategoryCreatedEvent with property values and no ID', () => {
				// arrange

				// act
				const entity = Category.create(category);

				// assert
				const events = entity.getUncommittedEvents();

				expect(events.length).toEqual(1);
				expect(events[0]).toBeInstanceOf(CategoryCreatedEvent);

				expect(events[0]).toMatchSnapshot({
					id: undefined,
					name: category.name,
					description: category.description,
					parentId: category.parentId,
					context: category.context,
				});
			});
		});

		describe('Success', () => {
			it('should apply CategoryCreatedEvent with property values and ID', () => {
				// arrange

				// act
				const entity = Category.create({
					...category,
					id: 1,
				});

				// assert
				const events = entity.getUncommittedEvents();

				expect(events.length).toEqual(1);
				expect(events[0]).toBeInstanceOf(CategoryCreatedEvent);

				expect(events[0]).toMatchSnapshot({
					id: expect.any(Number),
					name: category.name,
					description: category.description,
					parentId: category.parentId,
					context: category.context,
				});
			});
		});
	});

	describe('update', () => {
		it('should apply CategoryUpdatedEvent with properties to be updated', () => {
			// arrange
			const newContext = 'new-context';

			// act
			category.update({ context: newContext });

			// assert
			const events = category.getUncommittedEvents();

			expect(events[0]).toBeInstanceOf(CategoryUpdatedEvent);
			expect(events[0]).toMatchSnapshot();
		});
	});
});
