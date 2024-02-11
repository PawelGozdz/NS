import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

export class GetUserByIdIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.getUserById;

	payload: {
		userId: string;
	};

	constructor(userId: string) {
		super();

		this.payload = {
			userId,
		};
	}
}
