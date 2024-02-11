import { Address, EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class UserCreatedEvent extends Event<UserCreatedEvent> {
	id: EntityId;
	email: string;
	profile: {
		id: EntityId;
		userId: EntityId;
		firstName: string | null;
		lastName: string | null;
		username: string | null;
		address: Address | null;
		bio: string | null;
		dateOfBirth: Date | null;
		gender: string | null;
		hobbies: string[];
		languages: string[];
		phoneNumber: string | null;
		profilePicture: string | null;
		rodoAcceptanceDate: Date | null;
	};

	constructor(event: UserCreatedEvent) {
		super(event);

		Object.assign(this, event);
	}
}
