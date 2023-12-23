import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class UserUpdatedEvent extends Event<UserUpdatedEvent> {
	id: EntityId;
	email: string;

	constructor(event: UserUpdatedEvent) {
		super(event);

		Object.assign(this, event);
	}
}
