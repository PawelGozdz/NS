import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { Actor, GetUserByEmailIntegrationEvent } from '@app/core';
import { QueryBus } from '@libs/cqrs';

import { GetUserByEmailQuery } from '../application';
import { UserInfo } from '../domain';

@Injectable()
export class OnUGetUserByEmailEventHandler {
  constructor(private readonly queryBus: QueryBus) {}

  @OnEvent(GetUserByEmailIntegrationEvent.eventName)
  async onUserByEmailRequested(payload: GetUserByEmailIntegrationEvent): Promise<UserInfo | undefined> {
    const actor = Actor.create(payload.actor.type, payload.actor.source, payload.actor.id);

    try {
      return await this.queryBus.execute(
        new GetUserByEmailQuery({
          email: payload.payload.email,
          actor,
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
