import { Actor } from '@app/core';
import { Event } from '@libs/cqrs';

export class SkillCreatedEvent extends Event<SkillCreatedEvent> {
  id: number;

  name: string;

  description?: string | null;

  categoryId: number;

  actor: Actor;

  constructor(event: SkillCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
