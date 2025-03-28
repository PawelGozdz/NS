import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { GetUserByIdIntegrationEvent } from '@app/core';
import { QueryBus } from '@libs/cqrs';

import { GetUserByIdQuery } from '../application';
import { UserInfo } from '../domain';

@Injectable()
export class OnUGetUserByIdEventHandler {
  constructor(private readonly queryBus: QueryBus) {}

  @OnEvent(GetUserByIdIntegrationEvent.eventName)
  async onUserByIdRequested(payload: GetUserByIdIntegrationEvent): Promise<UserInfo | undefined> {
    try {
      return await this.queryBus.execute(
        new GetUserByIdQuery({
          userId: payload.payload.userId,
        }),
      );
    } catch (error) {
      return error;
    }
  }
}
