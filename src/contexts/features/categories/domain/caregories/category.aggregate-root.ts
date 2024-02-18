import { getNullOrValueField } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';

import { CategorySnapshot } from './category.snapshot';
import { CategoryCreatedEvent, CategoryUpdatedEvent } from './events';

const events = {
	CategoryCreatedEvent,
	CategoryUpdatedEvent,
};

export type CategoryEvents = typeof events;

export class Category extends AggregateRoot {
	id: number;
	name: string;
	description: string | null;
	parentId: number | null;
	context: string;

	constructor(props: ICategoryCreateData, version?: number) {
		super(version);

		if (props.id) {
			this.id = props.id;
		}

		this.name = props.name;
		this.description = props.description || null;
		this.parentId = props.parentId || null;
		this.context = props.context;
	}

	public static create(
		{
			id,
			name,
			description,
			parentId,
			context,
		}: {
			id?: number;
			name: string;
			description?: string | null;
			parentId?: number | null;
			context: string;
		},
		version?: number,
	): Category {
		const category = new Category(
			{
				id,
				name,
				description,
				parentId,
				context,
			},
			version,
		);

		category.apply(
			new CategoryCreatedEvent({
				id: category.id,
				name: category.name,
				description: category.description,
				parentId: category.parentId,
				context: category.context,
			}),
		);

		return category;
	}

	update(category: ICategoryUpdateData) {
		const potentialNewName = category.name ?? this.name;
		const potentialNewDescription = getNullOrValueField(category.description, this.description);
		const potentialNewContext = category.context ?? this.context;

		this.apply(
			new CategoryUpdatedEvent({
				id: this.id,
				name: potentialNewName,
				description: potentialNewDescription,
				context: potentialNewContext,
				parentId: this.parentId,
			}),
		);
	}

	public static restoreFromSnapshot(dao: CategorySnapshot): Category {
		const rentalPeriod = new Category(
			{
				id: dao.id,
				name: dao.name,
				description: dao?.description,
				parentId: dao.parentId,
				context: dao.context,
			},
			dao.version,
		);

		return rentalPeriod;
	}

	getId() {
		return this.id;
	}
}

export type ICategoryCreateData = {
	id?: number;
	name: string;
	description?: string | null;
	parentId?: number | null;
	context: string;
};

export type ICategoryUpdateData = {
	id?: number;
	name?: string;
	description?: string | null;
	context?: string;
};
