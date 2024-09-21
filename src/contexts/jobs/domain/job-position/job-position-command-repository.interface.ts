import { EntityId } from '@libs/common';

import { IJobPositionCreateData, IJobPositionUpdateData, JobPosition } from './job-position.entity';

export abstract class IJobPositionCommandRepository {
  abstract save(position: IJobPositionCreateData): Promise<{ id: string }>;

  abstract update(position: IJobPositionUpdateData): Promise<void>;

  abstract getOneById(id: EntityId): Promise<JobPosition | undefined>;

  abstract getOneByCategoryIdAndSlug(categoryId: number, slug: string): Promise<JobPosition | undefined>;
}
