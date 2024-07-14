import { Event } from '@libs/cqrs';

export interface IOutboxInput<T = unknown> {
  eventName: string;
  context: string;
  data: Event<T>;
}

export abstract class IOutboxModel implements IOutboxInput {
  id: number;

  eventName: string;

  context: string;

  data: Event<unknown>;

  createdAt: Date;

  publishedOn: Date | null;
}
