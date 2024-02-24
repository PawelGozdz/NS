import { AuthUserModel } from '@app/contexts';
import { AppUtils, dayjs } from '@libs/common';
import { testingDefaults } from '@libs/testing';
import _ from 'lodash';

export class AuthUserFixtureFactory {
	public static create(overrides?: Partial<AuthUserModel>): AuthUserModel {
		const userDao = new AuthUserModel();

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
