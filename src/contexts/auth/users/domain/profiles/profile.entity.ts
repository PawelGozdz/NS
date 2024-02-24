import { Address, EntityId } from '@libs/common';

import { ProfileSnapshot } from './profile.snapshot';

export type IProfileCreateData = {
	id: EntityId;
	userId: EntityId;
	firstName?: string;
	lastName?: string;
	username?: string;
	address?: Address;
	bio?: string;
	dateOfBirth?: Date;
	gender?: string;
	hobbies?: string[];
	languages?: string[];
	phoneNumber?: string;
	profilePicture?: string;
	rodoAcceptanceDate?: Date;
};

export type IProfileUpdateData = {
	firstName?: string | null;
	lastName?: string | null;
	username?: string | null;
	address?: Address | null;
	bio?: string | null;
	dateOfBirth?: Date | null;
	gender?: string | null;
	hobbies?: string[];
	languages?: string[];
	phoneNumber?: string | null;
	profilePicture?: string | null;
	rodoAcceptanceDate?: Date | null;
};

export class Profile {
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

	constructor(props: IProfileCreateData) {
		this.id = props.id;
		this.userId = props.userId ?? null;
		this.firstName = props.firstName ?? null;
		this.lastName = props.lastName ?? null;
		this.username = props.username ?? null;
		this.address = props.address ?? null;
		this.bio = props.bio ?? null;
		this.dateOfBirth = props.dateOfBirth ?? null;
		this.gender = props.gender ?? null;
		this.hobbies = props.hobbies ?? [];
		this.languages = props.languages ?? [];
		this.phoneNumber = props.phoneNumber ?? null;
		this.profilePicture = props.profilePicture ?? null;
		this.rodoAcceptanceDate = props.rodoAcceptanceDate ?? null;
	}

	public static create(profile: IProfileCreateData) {
		return new Profile({
			id: profile.id,
			userId: profile.userId,
			firstName: profile.firstName,
			lastName: profile.lastName,
			username: profile.username,
			address: profile.address,
			bio: profile.bio,
			dateOfBirth: profile.dateOfBirth,
			gender: profile.gender,
			hobbies: profile.hobbies,
			languages: profile.languages,
			phoneNumber: profile.phoneNumber,
			profilePicture: profile.profilePicture,
			rodoAcceptanceDate: profile.rodoAcceptanceDate,
		});
	}

	public static restoreFromSnapshot(dao: ProfileSnapshot) {
		return new Profile({
			id: new EntityId(dao.id),
			userId: new EntityId(dao.userId),
			firstName: dao.firstName ?? undefined,
			lastName: dao.lastName ?? undefined,
			username: dao.username ?? undefined,
			dateOfBirth: dao.dateOfBirth ?? undefined,
			address: dao.address ? Address.create(dao.address) : undefined,
			bio: dao.bio ?? undefined,
			gender: dao.gender ?? undefined,
			hobbies: dao.hobbies,
			languages: dao.languages,
			phoneNumber: dao.phoneNumber ?? undefined,
			profilePicture: dao.profilePicture ?? undefined,
			rodoAcceptanceDate: dao.rodoAcceptanceDate ?? undefined,
		});
	}
}
