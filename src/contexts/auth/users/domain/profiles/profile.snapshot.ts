import { Address } from '@libs/common';

export type ProfileSnapshot = {
	id: string;
	userId: string;
	firstName: string | null;
	lastName: string | null;
	username: string | null;
	address: Address | null;
	bio: string | null;
	gender: string | null;
	dateOfBirth: Date | null;
	hobbies: string[];
	languages: string[];
	phoneNumber: string | null;
	profilePicture: string | null;
	rodoAcceptanceDate: Date | null;
};
