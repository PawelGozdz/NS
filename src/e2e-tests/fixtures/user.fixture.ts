import _ from 'lodash';

import { UserModel, UserProfileModel } from '@app/contexts';
import { AppUtils } from '@libs/common';
import { testingDefaults } from '@libs/testing';

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
  public static create(overrides?: Partial<UserProfileModel>): UserProfileModel {
    const userDao = new UserProfileModel();

    const defaults = {
      id: AppUtils.getUUID(),
      userId: testingDefaults.userId,
      ...testingDefaults.profile,
    };

    return _.merge(userDao, defaults, overrides);
  }
}
