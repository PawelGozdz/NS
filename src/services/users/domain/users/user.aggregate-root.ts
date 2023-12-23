import { EntityId } from '@libs/common';
import { AggregateRoot } from '@libs/ddd';
import { UserCreatedEvent } from './events';
import { UserUpdatedEvent } from './events/user-updated.event';
import { UserSnapshot } from './user.snapshot';

const events = {
	UserCreatedEvent,
};

export type UserEvents = typeof events;

export class User extends AggregateRoot {
	id: EntityId;
	email: string;

	constructor(
		{
			id,
			email,
		}: {
			id: EntityId;
			email: string;
		},
		version?: number,
	) {
		super(version);

		this.id = id;
		this.email = email;
	}

	public static create(
		{
			email,
			id,
		}: {
			id?: EntityId;
			email: string;
		},
		version?: number,
	): User {
		const user = new User(
			{
				id: id ?? EntityId.createRandom(),
				email,
			},
			version,
		);

		user.apply(
			new UserCreatedEvent({
				id: user.id,
				email: user.email,
			}),
		);

		return user;
	}

	update({ email, roleId }: { email?: string; roleId?: string }) {
		const potentialNewEmail = email ?? this.email;

		this.apply(
			new UserUpdatedEvent({
				id: this.id,
				email: potentialNewEmail,
			}),
		);
	}

	public static restoreFromSnapshot(snapshot: UserSnapshot): User {
		const rentalPeriod = new User(
			{
				id: new EntityId(snapshot.id),
				email: snapshot.email,
			},
			snapshot.version,
		);

		return rentalPeriod;
	}

	getId(): string {
		return this.id.value;
	}

	getEmail(): string {
		return this.email;
	}

	private onUserCreatedEvent(event: UserCreatedEvent) {
		this.id = event.id;
		this.email = event.email;
	}

	private onUserUpdatedEvent(event: UserUpdatedEvent) {
		this.id = event.id;
		this.email = event.email;
	}
}
