import { Actor } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class JobPositionCreatedEvent extends Event<JobPositionCreatedEvent> {
  id: EntityId;

  title: string;

  categoryId: number;

  skillIds: number[];

  actor: Actor;

  constructor(event: JobPositionCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
