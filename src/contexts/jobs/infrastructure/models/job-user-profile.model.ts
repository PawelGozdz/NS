import { Certification, Education, Experience, IJobUserProfileModel, SalaryRange, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class JobUserProfileModel extends BaseModel implements IJobUserProfileModel {
  id: string;

  userId: string;

  bio: string | null;

  certificates: Certification[];

  education: Education[];

  experience: Experience[];

  jobPositionIds: string[];

  salaryRange: SalaryRange;

  jobIds: string[];

  updatedAt: Date;

  createdAt: Date;

  version: number;

  static tableName = TableNames.JOB_USER_PROFILES;
}
