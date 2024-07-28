import { Experience, IJobModel, SalaryRange, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class JobModel extends BaseModel implements IJobModel {
  id: string;

  title?: string;

  isActive: boolean;

  description: string;

  orgatnizationId?: string;

  jobPositionId: string;

  location: string;

  categoryIds: number[];

  salaryRange: SalaryRange;

  requiredSkills: Experience[];

  niceToHaveSkills: Experience[];

  requirements: string[];

  languages: string[];

  benefits: string[];

  startDate?: Date | null;

  endDate?: Date | null;

  publicationDate?: Date | null;

  expireDate: Date;

  contact?: string | null;

  createdAt: Date;

  updatedAt: Date;

  version: number;

  static tableName = TableNames.JOBS;
}
