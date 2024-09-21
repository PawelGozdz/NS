import { Actor } from '@app/core';
import { EntityId } from '@libs/common';
import { Event } from '@libs/cqrs';

export class JobPositionUpdatedEvent extends Event<JobPositionUpdatedEvent> {
  id: EntityId;

  title: string;

  slug: string;

  categoryId: number;

  skillIds: number[];

  actor: Actor;

  constructor(event: JobPositionUpdatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
