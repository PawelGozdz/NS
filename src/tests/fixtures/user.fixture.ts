import { UserDao } from '@app/contexts/auth';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class UserFixtureFactory {
	public static create(overrides?: Partial<UserDao>): UserDao {
		const userDao = new UserDao();

		const defaults = {
			id: uuidv4(),
			email: 'test@test.com',
			version: 1,
		};

		return _.merge(userDao, defaults, overrides);
	}
}
