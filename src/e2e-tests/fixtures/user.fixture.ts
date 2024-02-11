import { ProfileModel, UserModel } from '@app/contexts/auth';
import { AppUtils } from '@libs/common';
import { testingDefaults } from '@libs/testing';
import _ from 'lodash';

export class UserFixtureFactory {
	public static create(overrides?: Partial<UserModel>): UserModel {
		const userDao = new UserModel();

		const defaults = {
			id: testingDefaults.userId,
			email: testingDefaults.email,
			version: 1,
		};

		return _.merge(userDao, defaults, overrides);
	}
}

export class ProfileFixtureFactory {
	public static create(overrides?: Partial<ProfileModel>): ProfileModel {
		const userDao = new ProfileModel();

		const defaults = {
			id: AppUtils.getUUID(),
			userId: testingDefaults.userId,
			...testingDefaults.profile,
		};

		return _.merge(userDao, defaults, overrides);
	}
}
