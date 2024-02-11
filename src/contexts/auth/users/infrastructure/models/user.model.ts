import { TableNames } from '@app/database';
import { IUserModel } from '@libs/common';
import { BaseModel } from '@libs/ddd';
import { ProfileModel } from './profile.model';

export class UserModel extends BaseModel implements IUserModel {
	id: string;

	email: string;

	profile: ProfileModel;

	updatedAt: Date;

	createdAt: Date;

	version: number;

	static tableName = TableNames.USERS;
}
