import { IJobPositionQueryParams } from '@app/core';
import { EntityId } from '@libs/common';

export type JobPositionInfo = {
  id: string;
  title: string;
  skillIds: number[];
  categoryId: number;
};

export abstract class IJobPositionQueryRepository {
  abstract getOneById(id: EntityId): Promise<JobPositionInfo | undefined>;

  abstract getManyBy(query: IJobPositionQueryParams): Promise<JobPositionInfo[]>;
}
