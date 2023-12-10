import { IntegrationEvent } from '../integration-base.event';
import { IntegrationEventNames } from '../integration-events.enum';

interface IUserUpdate {
	id: string;
	hash?: string;
	hashedRt?: string | null;
	email?: string;
	roleId?: string;
}

export class UpdateUserIntegrationEvent extends IntegrationEvent {
	static readonly eventName = IntegrationEventNames.updateUser;

	payload: IUserUpdate;

	constructor(user: IUserUpdate) {
		super();

		this.payload = {
			id: user.id,
			hash: user.hash,
			roleId: user.roleId,
			hashedRt: user.hashedRt,
			email: user.email,
		};
	}
}
