import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

interface IUserCreate {
	email: string;
}

export class CreateUserIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.createUser;

	payload: IUserCreate;

	constructor(user: IUserCreate) {
		super();

		this.payload = {
			email: user.email,
		};
	}
}
