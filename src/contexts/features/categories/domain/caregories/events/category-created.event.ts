import { Event } from '@libs/cqrs';

export class CategoryCreatedEvent extends Event<CategoryCreatedEvent> {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  context: string;

  constructor(event: CategoryCreatedEvent) {
    super(event);

    Object.assign(this, event);
  }
}
