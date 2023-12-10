import { v4 as uuid } from 'uuid';

export abstract class IntegrationEvent {
	public integrationEventId: string;
	public integrationEventOccuredON: Date;

	constructor() {
		this.integrationEventId = uuid();
		this.integrationEventOccuredON = new Date();
	}
}
