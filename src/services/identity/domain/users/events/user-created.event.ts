import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class UserCreatedEvent extends Event<UserCreatedEvent> {
	id: EntityId;
	email: string;
	roleId: EntityId;
	hash: string;
	hashedRt: string | null;
}
