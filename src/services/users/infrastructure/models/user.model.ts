import { BaseModel } from '@libs/ddd';

export class UserModel extends BaseModel {
	id: string;

	email: string;

	updatedAt: Date;

	createdAt: Date;

	version: number;

	static tableName = 'users';

	static relationMappings = {};
}
