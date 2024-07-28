import { Actor } from '@app/core/value-objects';
import { Event } from '@libs/cqrs';

export interface IOutboxInput<T = unknown> {
  eventName: string;
  context: string;
  data: Event<T>;
  actor: Actor;
}

export abstract class IOutboxModel implements Omit<IOutboxInput, 'actor'> {
  id: number;

  eventName: string;

  context: string;

  data: Event<unknown>;

  createdAt: Date;

  publishedOn: Date | null;
}
