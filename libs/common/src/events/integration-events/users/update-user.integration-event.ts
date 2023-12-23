import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

interface IUserUpdate {
	id: string;
	email?: string;
}

export class UpdateUserIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.updateUser;

	payload: IUserUpdate;

	constructor(user: IUserUpdate) {
		super();

		this.payload = {
			id: user.id,
			email: user.email,
		};
	}
}
