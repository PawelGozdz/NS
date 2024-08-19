import { Certification, Education, Experience, SalaryRange } from '@app/core';

export abstract class IJobUserProfileModel {
  id: string;

  bio: string | null;

  userId: string;

  salaryRange: SalaryRange;

  jobIds: string[];

  jobPositionIds: string[];

  experience: Experience[];

  education: Education[];

  certificates: Certification[];

  createdAt: Date;

  updatedAt: Date;

  version: number;
}
