import { Event } from '@libs/cqrs';

export interface IOutboxInput<T = unknown> {
  eventName: string;
  context: string;
  payload: Event<T>;
}

export abstract class IOutboxModel implements IOutboxInput {
  id: number;

  eventName: string;

  context: string;

  payload: Event<unknown>;

  createdAt: Date;

  publishedOn: Date | null;
}
