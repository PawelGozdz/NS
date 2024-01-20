import { TableNames } from '@app/database';
import { IUserDao } from '@app/database/kysley';
import { BaseModel } from '@libs/ddd';

// small trick for the sake of simplicity of Kysely
export class UserDao extends BaseModel implements IUserDao {
	id: string;

	email: string;

	updatedAt: Date;

	createdAt: Date;

	version: number;

	static tableName = TableNames.USERS;
}
