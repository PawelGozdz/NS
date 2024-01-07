import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class UserCreatedEvent extends Event<UserCreatedEvent> {
	id: EntityId;
	email: string;

	constructor(event: UserCreatedEvent) {
		super(event);

		Object.assign(this, event);
	}
}
