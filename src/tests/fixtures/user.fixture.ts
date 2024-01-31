import { UserDao } from '@app/contexts/auth';
import { testingDefaults } from '@libs/testing';
import _ from 'lodash';

export class UserFixtureFactory {
	public static create(overrides?: Partial<UserDao>): UserDao {
		const userDao = new UserDao();

		const defaults = {
			id: testingDefaults.userId,
			email: testingDefaults.email,
			version: 1,
		};

		return _.merge(userDao, defaults, overrides);
	}
}
