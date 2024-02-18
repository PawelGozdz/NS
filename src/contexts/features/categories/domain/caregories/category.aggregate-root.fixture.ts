import { Category } from './category.aggregate-root';

type Input = {
	id?: number;
	name?: string;
	description?: string;
	context?: string;
	parentId?: number;
};

export class CategoryAggregateRootFixtureFactory {
	public static create(overrides?: Input): Category {
		const id = overrides?.id;
		const name = overrides?.name ? overrides.name : 'Grocery';
		const description = overrides?.description ? overrides.description : 'Grocery category';
		const context = overrides?.context ? overrides.context : 'test-context';
		const parentId = overrides?.parentId ? overrides.parentId : null;

		return new Category({
			id,
			name,
			description,
			context,
			parentId,
		});
	}
}
