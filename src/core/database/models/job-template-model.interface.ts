import { Experience, SalaryRange } from '@app/core';

export abstract class IJobTemplateModel {
  id: string;

  jobPositionId: string;

  description: string;

  location: string;

  categoryIds: string[];

  salaryRange: SalaryRange;

  requiredSkills: Experience[];

  nicetoHaveSkills: Experience[];

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
}
