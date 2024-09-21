import _ from 'lodash';

import { JobModel, JobPositionModel, JobUserProfileModel } from '@app/contexts';
import { AppUtils, generateSlug } from '@libs/common';
import { testingDefaults } from '@libs/testing';

export class JobFixtureFactory {
  public static create(overrides?: Partial<JobModel>): JobModel {
    const skillDao = new JobModel();

    const defaults = {
      id: AppUtils.getUUID(),
      ...testingDefaults.job,
    };

    return _.merge(skillDao, defaults, overrides);
  }
}

export class JobUserProfileFixtureFactory {
  public static create(overrides?: Partial<JobUserProfileModel>): JobUserProfileModel {
    const skillDao = new JobUserProfileModel();

    const defaults = {
      id: AppUtils.getUUID(),
      ...testingDefaults.jobUserProfile,
    };

    return _.merge(skillDao, defaults, overrides);
  }
}

export class JobPositionFixtureFactory {
  public static create(overrides?: Partial<JobPositionModel>): JobPositionModel {
    const skillDao = new JobPositionModel();

    const defaults = {
      id: overrides?.id,
      ...testingDefaults.jobPosition,
      slug: generateSlug(overrides?.title ?? testingDefaults.jobPosition.title),
    };

    return _.merge(skillDao, defaults, overrides);
  }
}
