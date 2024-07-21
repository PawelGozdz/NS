import { Event } from '@libs/cqrs';

export class SkillCreatedEvent extends Event<SkillCreatedEvent> {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  context: string;

  constructor(event: SkillCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
