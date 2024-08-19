import { IUpdateProfile } from '@app/core';
import { IActor } from '@libs/common';

import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

export interface IUserUpdateIntegration {
  id: string;
  email?: string;
  profile?: IUpdateProfile;
}

export class UpdateUserIntegrationEvent extends IntegrationEvent {
  static readonly eventName = IntegrationEventNames.updateUser;

  payload: IUserUpdateIntegration;

  actor: IActor;

  constructor(user: IUserUpdateIntegration) {
    super();

    this.payload = {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }
}
