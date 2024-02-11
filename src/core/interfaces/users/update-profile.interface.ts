import { CountryCode } from '@libs/common';

export type IUpdateProfile = {
	firstName?: string | null;
	lastName?: string | null;
	username?: string | null;
	address?: {
		street: string;
		streetNumber?: string | undefined;
		city: string;
		countryCode: CountryCode;
		postalCode: string;
	};
	bio?: string | null;
	gender?: string | null;
	dateOfBirth?: Date | null;
	hobbies?: string[];
	languages?: string[];
	phoneNumber?: string | null;
	profilePicture?: string | null;
	rodoAcceptanceDate?: Date | null;
};
