import { IJobQueryParams } from '@app/core';
import { EntityId } from '@libs/common';

export type JobInfo = {
  id: string;
  title: string | null;
  isActive: boolean;
  description: string;
  organizationId: string | null;
  jobPositionId: string;
  location: string;
  categoryIds: number[];
  salaryRange: {
    from: number;
    to: number;
  };
  requiredSkills: {
    skillId: number;
    startDate: Date | null;
    endDate: Date | null;
    experienceInMonths: number;
  }[];
  niceToHaveSkills: {
    skillId: number;
    startDate: Date | null;
    endDate: Date | null;
    experienceInMonths: number;
  }[];
  requirements: string[];
  languages: string[];
  benefits: string[];
  startDate: Date | null;
  endDate: Date | null;
  publicationDate: Date | null;
  expireDate: Date | null;
  contact: string | null;
};

export abstract class IJobQueryRepository {
  abstract getOneById(id: EntityId): Promise<JobInfo | undefined>;

  abstract getMany(params?: IJobQueryParams): Promise<JobInfo[]>;
}
