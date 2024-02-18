import { Event } from '@libs/cqrs';

export class CategoryUpdatedEvent extends Event<CategoryUpdatedEvent> {
	id: number;
	name: string;
	description: string | null;
	parentId: number | null;
	context: string;

	constructor(event: CategoryUpdatedEvent) {
		super(event);

		Object.assign(this, event);
	}
}
