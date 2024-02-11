import { CountryCode, EntityId } from '@libs/common';

export type ProfileInfo = {
	id: string;

	userId: string;

	firstName: string | null;

	lastName: string | null;

	dateOfBirth: Date | null;

	username: string | null;

	phoneNumber: string | null;

	gender: string | null;

	bio: string | null;

	hobbies: string[];

	languages: string[];

	profilePicture?: string | null;

	rodoAcceptanceDate?: Date | null;

	address: {
		street: string;
		streetNumber: string | undefined;
		city: string;
		countryCode: CountryCode;
		postalCode: string;
	} | null;
};

export abstract class IUsersQueryRepository {
	abstract getOneById(id: EntityId): Promise<ProfileInfo | undefined>;
	abstract getOneByUserId(userId: EntityId): Promise<ProfileInfo | undefined>;
}
