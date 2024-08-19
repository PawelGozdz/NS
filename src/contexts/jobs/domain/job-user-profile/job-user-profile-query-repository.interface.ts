import { IJobUserProfileQueryParams } from '@app/core';
import { EntityId } from '@libs/common';

export type JobUserProfileInfo = {
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
};

export abstract class IJobUserProfileQueryRepository {
  abstract getOneById(id: EntityId): Promise<JobUserProfileInfo | undefined>;

  abstract getOneByUserId(userId: EntityId): Promise<JobUserProfileInfo | undefined>;

  abstract getMany(params?: IJobUserProfileQueryParams): Promise<JobUserProfileInfo[]>;
}
