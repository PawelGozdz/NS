import { IEvent } from '@nestjs/cqrs';

export abstract class Event<TCommand> implements IEvent {
  constructor(event: Omit<TCommand, keyof Event<TCommand>>) {
    Object.assign(this, event);
  }
}
