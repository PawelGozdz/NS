/* eslint-disable no-restricted-imports */
import { IEvent } from '@nestjs/cqrs';

export interface IEventBus<EventBase extends IEvent = IEvent> {
  publish<T extends EventBase = EventBase>(event: T): Promise<any>;
  publishAll<T extends EventBase = EventBase>(events: T[]): Promise<any>;
}
