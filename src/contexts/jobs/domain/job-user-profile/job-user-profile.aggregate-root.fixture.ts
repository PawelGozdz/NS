import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';

import { JobUserProfile } from './job-user-profile.aggregate-root';

export class JobUserProfileAggregateRootFixtureFactory {
  public static create(overrides?: {
    id?: string;
    userId?: string;
    bio?: string | null;
    salaryRange?: SalaryRange;
    jobIds?: string[];
    jobPositionIds?: string[];
    experience?: Experience[];
    education?: Education[];
    certificates?: Certification[];
    actor?: Actor;
  }): JobUserProfile {
    const id = overrides?.id ? new EntityId(overrides.id) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3a');
    const userId = overrides?.id ? new EntityId(overrides.id) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3c');
    const bio = overrides?.bio ?? 'My Bio';
    const salaryRange = overrides?.salaryRange ?? SalaryRange.create(1000, 2000);
    const jobIds = overrides?.jobIds
      ? overrides.jobIds.map((jobId) => new EntityId(jobId))
      : [new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3b'), new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba30')];
    const jobPositionIds = overrides?.jobPositionIds
      ? overrides.jobPositionIds.map((jobPositionId) => new EntityId(jobPositionId))
      : [new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba31'), new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba32')];

    const experience = overrides?.experience
      ? overrides.experience
      : [Experience.create(33, new Date('2021-10-20T16:00:00.000Z'), new Date('2021-10-27T16:00:00.000Z'), 3)];

    const education = overrides?.education ? overrides.education : [Education.create('My School', 'My Degree', 2024)];
    const certificates = overrides?.certificates ? overrides.certificates : [Certification.create('My Certificate', 'My Issuer', 2024)];

    return new JobUserProfile({
      id,
      userId,
      bio,
      salaryRange,
      jobIds,
      jobPositionIds,
      experience,
      education,
      certificates,
    });
  }
}
