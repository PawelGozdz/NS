import { Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';

import { Job } from './job.aggregate-root';

export class JobAggregateRootFixtureFactory {
  public static create(overrides?: {
    id?: EntityId;
    title?: string | null;
    isActive?: boolean;
    description?: string | null;
    jobPositionId?: EntityId;
    location?: string;
    categoryIds?: number[];
    organizationId?: EntityId;
    salaryRange?: SalaryRange;
    requiredSkills?: Experience[];
    niceToHaveSkills?: Experience[];
    requirements?: string[];
    languages?: string[];
    benefits?: string[];
    startDate?: Date | null;
    endDate?: Date | null;
    publicationDate?: Date | null;
    expireDate?: Date | null;
    contact?: string | null;
  }): Job {
    const id = overrides?.id ?? new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3a');
    const title = overrides?.title ?? 'Default Title';
    const isActive = overrides?.isActive ?? true;
    const description = overrides?.description ?? 'Default Description';
    const organizationId = overrides?.organizationId ? overrides.organizationId : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3a');
    const jobPositionId = overrides?.jobPositionId ?? new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3b');
    const location = overrides?.location ?? 'Default Location';
    const categoryIds = overrides?.categoryIds ?? [1, 5, 7];
    const salaryRange = overrides?.salaryRange ?? SalaryRange.create(1000, 2000);
    const requiredSkills = overrides?.requiredSkills ?? [Experience.create(44, new Date(), null, 3)];
    const niceToHaveSkills = overrides?.niceToHaveSkills ?? [Experience.create(44, new Date(), null, 2)];
    const requirements = overrides?.requirements ?? ['Requirement1'];
    const languages = overrides?.languages ?? ['English'];
    const benefits = overrides?.benefits ?? ['Benefit1'];
    const startDate = overrides?.startDate ?? new Date();
    const endDate = overrides?.endDate ?? null;
    const publicationDate = overrides?.publicationDate ?? new Date();
    const expireDate = overrides?.expireDate ?? new Date();
    const contact = overrides?.contact ?? 'contact@example.com';

    return new Job({
      id,
      title,
      isActive,
      description,
      jobPositionId,
      location,
      categoryIds,
      salaryRange,
      requiredSkills,
      niceToHaveSkills,
      requirements,
      languages,
      benefits,
      startDate,
      endDate,
      publicationDate,
      expireDate,
      contact,
      organizationId,
    });
  }
}
