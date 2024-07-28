import { IJobPositionModel, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class JobPositionModel extends BaseModel implements IJobPositionModel {
  id: string;

  title: string;

  categoryId: number;

  skillIds: number[];

  createdAt: Date;

  updatedAt: Date;

  version: number;

  static tableName = TableNames.JOB_POSITIONS;
}
