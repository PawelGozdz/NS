import { TableNames } from '@app/database';
import { Address, IProfileModel } from '@libs/common';
import { BaseModel } from '@libs/ddd';

export class ProfileModel extends BaseModel implements IProfileModel {
	id: string;

	userId: string;

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

	updatedAt: Date;

	createdAt: Date;

	static tableName = TableNames.PROFILES;
}
