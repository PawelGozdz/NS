export type JobSnapshot = {
  id: string;
  title: string | null;
  isActive: boolean;
  description: string;
  organizationId?: string;
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
  createdAt: Date;
  updatedAt: Date;

  version: number;
};
