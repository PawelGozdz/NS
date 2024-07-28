import { Actor, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class JobCreatedEvent extends Event<JobCreatedEvent> {
  id: EntityId;

  title: string | null;

  isActive: boolean;

  description: string | null;

  organizationId: EntityId | null;

  jobPositionId: EntityId;

  location: string | null;

  categoryIds: number[];

  salaryRange: SalaryRange | null;

  requiredSkills: Experience[];

  niceToHaveSkills: Experience[];

  requirements: string[];

  languages: string[];

  benefits: string[];

  startDate: Date | null;

  endDate: Date | null;

  publicationDate: Date | null;

  expireDate: Date | null;

  contact: string | null;

  actor: Actor;

  constructor(event: JobCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
