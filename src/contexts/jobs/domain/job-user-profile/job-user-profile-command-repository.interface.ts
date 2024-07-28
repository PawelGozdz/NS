import { EntityId } from '@libs/common';

import { JobUserProfile } from './job-user-profile.aggregate-root';

export abstract class IJobUserProfileCommandRepository {
  abstract save(user: JobUserProfile): Promise<void>;

  abstract getOneById(id: EntityId): Promise<JobUserProfile | undefined>;

  abstract getOneByUserId(userId: EntityId): Promise<JobUserProfile | undefined>;
}
