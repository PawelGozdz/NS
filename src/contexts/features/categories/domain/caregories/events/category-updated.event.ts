import { Actor } from '@app/core';
import { Event } from '@libs/cqrs';

export class CategoryUpdatedEvent extends Event<CategoryUpdatedEvent> {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  actor: Actor;

  constructor(event: CategoryUpdatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
