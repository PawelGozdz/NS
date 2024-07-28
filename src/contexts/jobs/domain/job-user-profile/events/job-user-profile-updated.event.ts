import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class JobUserProfileUpdatedEvent extends Event<JobUserProfileUpdatedEvent> {
  id: EntityId;

  userId: EntityId;

  bio: string | null;

  salaryRange: SalaryRange;

  jobIds: EntityId[];

  jobPositionIds: EntityId[];

  experience: Experience[];

  education: Education[];

  certificates: Certification[];

  createdAt: Date;

  updatedAt: Date;

  actor: Actor;

  constructor(event: JobUserProfileUpdatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
