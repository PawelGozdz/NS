import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Actor, UpdateUserIntegrationEvent } from '@app/core';
import { CommandBus } from '@libs/cqrs';

import { UpdateUserCommand } from '../application';

@Injectable()
export class OnUpdateUserEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(UpdateUserIntegrationEvent.eventName)
  async onUserUpdated(data: UpdateUserIntegrationEvent): Promise<void> {
    const { id, email, profile } = data.payload;

    const actor = Actor.create(data.actor.type, data.actor.source, data.actor.id);

    try {
      return await this.commandBus.execute(
        new UpdateUserCommand({
          id,
          email,
          profile,
          actor,
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
