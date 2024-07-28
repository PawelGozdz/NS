import { Actor, Certification, Education, Experience, SalaryRange } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class JobUserProfileCreatedEvent extends Event<JobUserProfileCreatedEvent> {
  id: EntityId;

  userId: EntityId;

  bio: string | null;

  salaryRange: SalaryRange;

  jobIds: EntityId[];

  jobPositionIds: EntityId[];

  experience: Experience[];

  education: Education[];

  certificates: Certification[];

  actor: Actor;

  constructor(event: JobUserProfileCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
