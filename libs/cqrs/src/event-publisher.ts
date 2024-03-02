/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
import { Injectable } from '@nestjs/common';
import { AggregateRoot, IEvent } from '@nestjs/cqrs';

import { EventBus } from './event-bus';

export type Constructor<T> = new (...args: any[]) => T;

@Injectable()
export class EventPublisher<EventBase extends IEvent = IEvent> {
  constructor(private readonly eventBus: EventBus<EventBase>) {}

  mergeClassContext<T extends Constructor<AggregateRoot<EventBase>>>(metatype: T): T {
    const { eventBus } = this;
    return class extends metatype {
      publish(event: EventBase) {
        return eventBus.publish(event);
      }

      publishAll(events: EventBase[]) {
        return eventBus.publishAll(events);
      }
    };
  }

  mergeObjectContext<T extends AggregateRoot<EventBase>>(object: T): T {
    const { eventBus } = this;
    object.publish = (event: EventBase) => eventBus.publish(event);

    object.publishAll = (events: EventBase[]) => eventBus.publishAll(events);
    return object;
  }
}
