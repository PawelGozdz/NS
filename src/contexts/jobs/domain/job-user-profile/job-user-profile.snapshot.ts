export type JobUserProfileSnapshot = {
  id: string;
  bio: string | null;
  userId: string;
  salaryRange: {
    from: number;
    to: number;
  };
  jobIds: string[];
  jobPositionIds: string[];
  experience: {
    skillId: number;
    startDate: Date | null;
    endDate: Date | null;
    experienceInMonths: number;
  }[];
  education: {
    degree: string;
    institution: string;
    graduateYear: number;
  }[];
  certificates: {
    name: string;
    institution: string;
    completionYear: number;
  }[];
  createdAt: Date;
  updatedAt: Date;

  version: number;
};
