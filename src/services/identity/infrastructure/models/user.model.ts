import { BaseModel } from '@libs/ddd';

export class UserModel extends BaseModel {
	id: string;

	name: string;

	roleId: string;

	hash: string;

	hashedRt: string | null;

	updatedAt: Date;

	createdAt: Date;

	version: number;

	static tableName = 'users';

	static relationMappings = {};
}
