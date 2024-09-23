import { IJobPositionModel, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class JobPositionModel extends BaseModel implements IJobPositionModel {
  id: string;

  title: string;

  slug: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;

  static tableName = TableNames.JOB_POSITIONS;
}
