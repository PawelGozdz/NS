import { ICompanyQueryParams } from '@app/core';
import { EntityId } from '@libs/common';

export type CompanyInfo = {
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

export abstract class ICompanyQueryRepository {
  abstract getOneById(id: EntityId): Promise<CompanyInfo | undefined>;

  abstract getMany(params?: ICompanyQueryParams): Promise<CompanyInfo[]>;
}
