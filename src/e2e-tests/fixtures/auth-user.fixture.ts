import { AuthUserDao } from '@app/contexts/auth';
import { dayjs } from '@libs/common';
import { AppUtils } from '@libs/common/utils/app-utils';
import { testingDefaults } from '@libs/testing';
import _ from 'lodash';

export class AuthUserFixtureFactory {
	public static create(overrides?: Partial<AuthUserDao>): AuthUserDao {
		const userDao = new AuthUserDao();

		const defaults = {
			id: AppUtils.getUUID(),
			email: testingDefaults.email,
			hash: testingDefaults.hash,
			userId: testingDefaults.userId,
			hashedRt: testingDefaults.hashedRt,
			lastLogin: dayjs().subtract(12, 'hour').toDate(),
		};

		return _.merge(userDao, defaults, overrides);
	}
}
