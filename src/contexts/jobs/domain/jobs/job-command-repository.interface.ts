import { EntityId } from '@libs/common';

import { Job } from './job.aggregate-root';

export abstract class IJobCommandRepository {
  abstract save(user: Job): Promise<void>;

  abstract getOneById(id: EntityId): Promise<Job | undefined>;
}
