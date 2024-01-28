import { AuthUserDao } from '@app/contexts/auth';
import { dayjs } from '@libs/common';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';

export class AuthUserFixtureFactory {
	public static create(overrides?: Partial<AuthUserDao>): AuthUserDao {
		const userDao = new AuthUserDao();

		const defaults = {
			id: uuidv4(),
			email: 'test@test.com',
			hash: 'some-hash',
			userId: uuidv4(),
			hashedRt: null,
			lastLogin: dayjs().subtract(12, 'hour').toDate(),
		};

		return _.merge(userDao, defaults, overrides);
	}
}
