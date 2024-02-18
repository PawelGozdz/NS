import { Event } from '@libs/cqrs';

export interface IOutboxInput<T = any> {
	eventName: string;
	context: string;
	payload: Event<T>;
}

export interface IOutbox extends IOutboxInput {
	id: number;
	createdAt: Date;
	publishedOn: Date | null;
}
