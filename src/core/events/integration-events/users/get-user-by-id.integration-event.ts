import { IActor } from '@libs/common';

import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

export class GetUserByIdIntegrationEvent extends IntegrationEvent {
  static readonly eventName = IntegrationEventNames.getUserById;

  payload: {
    userId: string;
  };

  actor: IActor;

  constructor(userId: string) {
    super();

    this.payload = {
      userId,
    };
  }
}
