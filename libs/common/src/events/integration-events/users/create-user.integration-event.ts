import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

interface IUserCreate {
	hash: string;
	hashedRt: string | null;
	email: string;
	roleId: string;
}

export class CreateUserIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.createUser;

	payload: IUserCreate;

	constructor(user: IUserCreate) {
		super();

		this.payload = {
			hash: user.hash,
			roleId: user.roleId,
			hashedRt: user.hashedRt,
			email: user.email,
		};
	}
}
