import { EntityId, Nullable, getCoalescedField } from '@libs/common';
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
	roleId: EntityId;
	hash: string;
	hashedRt: string | null;

	constructor(
		{
			id,
			email,
			roleId,
			hash,
			hashedRt,
		}: {
			id: EntityId;
			email: string;
			roleId: EntityId;
			hash: string;
			hashedRt: string | null;
		},
		version?: number,
	) {
		super(version);

		this.id = id;
		this.email = email;
		this.roleId = roleId;
		this.hash = hash;
		this.hashedRt = hashedRt;
	}

	public static create(
		{
			hash,
			hashedRt,
			email,
			roleId,
			id,
		}: {
			id?: EntityId;
			email: string;
			roleId: EntityId;
			hash: string;
			hashedRt: string | null;
		},
		version?: number,
	): User {
		const user = new User(
			{
				id: id ?? EntityId.createRandom(),
				hash,
				hashedRt,
				email,
				roleId,
			},
			version,
		);

		user.apply(
			new UserCreatedEvent({
				id: user.id,
				hash: user.hash,
				hashedRt: user.hashedRt,
				email: user.email,
				roleId: user.roleId,
			}),
		);

		return user;
	}

	update({ email, hash, hashedRt, roleId }: { email?: string; hash?: string; hashedRt?: Nullable<string>; roleId?: string }) {
		const potentialNewRoleId = roleId ?? this.roleId.value;
		const newHash = hash ?? this.hash;
		const potentialNewHashedRt = getCoalescedField(hashedRt, this.hashedRt);
		const potentialNewEmail = email ?? this.email;

		this.apply(
			new UserUpdatedEvent({
				id: this.id,
				email: potentialNewEmail,
				roleId: new EntityId(potentialNewRoleId),
				hash: newHash,
				hashedRt: potentialNewHashedRt,
			}),
		);
	}

	public static restoreFromSnapshot(snapshot: UserSnapshot): User {
		const rentalPeriod = new User(
			{
				id: new EntityId(snapshot.id),
				hash: snapshot.hash,
				hashedRt: snapshot.hashedRt,
				email: snapshot.email,
				roleId: new EntityId(snapshot.roleId),
			},
			snapshot.version,
		);

		return rentalPeriod;
	}

	getId(): string {
		return this.id.value;
	}
}
