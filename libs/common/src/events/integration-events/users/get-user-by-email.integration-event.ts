import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

export class GetUserByEmailIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.getUserByEmail;

	payload: {
		email: string;
	};

	constructor(email: string) {
		super();

		this.payload = {
			email,
		};
	}
}
