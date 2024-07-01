import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GetUserByEmailIntegrationEvent } from '@app/core';
import { QueryBus } from '@libs/cqrs';

import { GetUserByEmailQuery } from '../application';
import { UserInfo } from '../domain';

@Injectable()
export class OnUGetUserByEmailEventHandler {
  constructor(private readonly queryBus: QueryBus) {}

  @OnEvent(GetUserByEmailIntegrationEvent.eventName)
  async onUserByEmailRequested(payload: GetUserByEmailIntegrationEvent): Promise<UserInfo | undefined> {
    try {
      return await this.queryBus.execute(
        new GetUserByEmailQuery({
          email: payload.payload.email,
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
