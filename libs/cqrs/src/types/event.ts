import { IEvent } from '@nestjs/cqrs';

import { IActor } from '@libs/common';

export abstract class Event<TCommand> implements IEvent {
  abstract actor: IActor;

  constructor(event: Omit<TCommand, keyof Event<TCommand>>) {
    Object.assign(this, event);
  }
}
