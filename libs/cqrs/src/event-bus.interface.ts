import { IEvent } from '@nestjs/cqrs';

export interface IEventBus<EventBase extends IEvent = IEvent> {
  publish<T extends EventBase = EventBase>(event: T): Promise<unknown>;
  publishAll<T extends EventBase = EventBase>(events: T[]): Promise<unknown>;
}
