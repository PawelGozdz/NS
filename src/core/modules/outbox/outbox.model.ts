import { Event } from '@libs/cqrs';
import { IOutbox } from './types';

export class Outbox {
	public id: number;
	public eventName: string;
	public ctx: string;
	public payload: Event<any>;
	public createdAt: Date;
	public publishedOn: Date | null;

	constructor(props: { id: number; eventName: string; ctx: string; payload: Event<any>; createdAt: Date; publishedOn: Date | null }) {
		this.id = props.id;
		this.eventName = props.eventName;
		this.ctx = props.ctx;
		this.payload = props.payload;
		this.createdAt = props.createdAt;
		this.publishedOn = props.publishedOn;
	}
}

export class OutboxModel implements IOutbox {
	public id: number;
	public eventName: string;
	public ctx: string;
	public payload: Event<any>;
	public createdAt: Date;
	public publishedOn: Date | null;

	constructor(props: { id: number; eventName: string; ctx: string; payload: Event<any>; createdAt: Date; publishedOn: Date | null }) {
		this.id = props.id;
		this.eventName = props.eventName;
		this.ctx = props.ctx;
		this.payload = props.payload;
		this.createdAt = props.createdAt;
		this.publishedOn = props.publishedOn;
	}
}
