import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Actor, CreateUserIntegrationEvent } from '@app/core';
import { CommandBus } from '@libs/cqrs';

import { CreateUserCommand, CreateUserResponse } from '../application';

@Injectable()
export class OnCreateUserEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  @OnEvent(CreateUserIntegrationEvent.eventName)
  async onUserCreated(payload: CreateUserIntegrationEvent): Promise<CreateUserResponse> {
    const actor = Actor.create(payload.actor.type, payload.actor.source, payload.actor.id);

    try {
      return await this.commandBus.execute(
        new CreateUserCommand({
          email: payload.payload.email,
          actor,
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
