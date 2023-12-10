import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class UserUpdatedEvent extends Event<UserUpdatedEvent> {
	id: EntityId;
	email: string;
	roleId: EntityId;
	hash: string;
	hashedRt?: string | null;
}
