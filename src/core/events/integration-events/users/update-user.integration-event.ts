import { IUpdateProfile } from '@app/core';

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

  constructor(user: IUserUpdateIntegration) {
    super();

    this.payload = {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };
  }
}
