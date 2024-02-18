import { CountryCode } from '@libs/common';

export abstract class IUserProfileModel {
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

	updatedAt: Date;

	createdAt: Date;
}
