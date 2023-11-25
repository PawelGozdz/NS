import { Injectable, Type } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IEvent, IEventBus, IEventHandler } from '@nestjs/cqrs';
import { EVENTS_HANDLER_METADATA } from '@nestjs/cqrs/dist/decorators/constants';
import { defaultGetEventId, defaultReflectEventId } from '@nestjs/cqrs/dist/helpers/default-get-event-id';
import { IEventPublisher } from './event-publisher.interface';

export type EventHandlerType<EventBase extends IEvent = IEvent> = Type<IEventHandler<EventBase>>;

type EventHandlersById<EventBase extends IEvent = IEvent> = Record<string, Array<IEventHandler<EventBase>>>;

@Injectable()
export class EventBus<EventBase extends IEvent = IEvent> implements IEventBus<EventBase>, IEventPublisher<EventBase> {
	protected getEventId: (event: EventBase) => string | null;

	private readonly eventHandlersById: EventHandlersById<EventBase> = {};

	constructor(private readonly moduleRef: ModuleRef) {
		this.getEventId = defaultGetEventId;
	}

	async publish<T extends EventBase>(event: T) {
		const eventId = this.getEventId(event);

		const handlers = this.eventHandlersById[eventId!] ?? [];

		for (const handler of handlers) {
			await handler.handle(event);
		}
	}

	async publishAll<T extends EventBase>(events: T[]) {
		for (const event of events) {
			await this.publish(event);
		}
	}

	bind(handler: IEventHandler<EventBase>, id: string) {
		let handlers = this.eventHandlersById[id];

		if (handlers == null) {
			handlers = [];
			this.eventHandlersById[id] = handlers;
		}

		handlers.push(handler);
	}

	register(handlers: Array<EventHandlerType<EventBase>> = []) {
		handlers.forEach((handler) => this.registerHandler(handler));
	}

	protected registerHandler(handler: EventHandlerType<EventBase>) {
		const instance = this.moduleRef.get(handler, { strict: false });
		if (!instance) {
			return;
		}
		const events = this.reflectEvents(handler);
		events.map((event) => this.bind(instance, defaultReflectEventId(event)));
	}

	private reflectEvents(handler: EventHandlerType<EventBase>): FunctionConstructor[] {
		return Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler) as FunctionConstructor[];
	}
}
