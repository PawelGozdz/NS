/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { EntityId } from '@libs/common';

import { IJobPositionCreateData, JobPosition } from './job-position.entity';

export class JobPositionEntityFixtureFactory {
  public static create(overrides?: Partial<IJobPositionCreateData>): JobPosition {
    const id = overrides?.id ?? EntityId.createRandom();

    const title = overrides?.title ? overrides.title : 'HR Manager';
    const categoryId = overrides?.categoryId ? overrides.categoryId : 3;
    const skillIds = overrides?.skillIds ? [...overrides.skillIds] : [1, 2, 3];

    return new JobPosition({
      id,
      title,
      skillIds,
      categoryId,
    });
  }
}
