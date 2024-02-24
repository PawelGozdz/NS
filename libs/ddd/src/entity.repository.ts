import { TableNames } from '@app/core';
import { ConflictError } from '@libs/common';
import { EventBus, IEvent } from '@libs/cqrs';
import { AggregateRoot, BaseModel } from '@libs/ddd';
import { Kysely, Transaction } from 'kysely';

export type EventHandler = <T extends unknown>(event: IEvent, trx: Transaction<T>) => Promise<void> | void;

export abstract class EntityRepository {
	protected constructor(
		private readonly eventBus: EventBus,
		protected model: typeof BaseModel,
		protected db: Kysely<any>,
	) {}

	protected async handleUncommittedEvents(aggregate: AggregateRoot) {
		const handlerMap = this as unknown as Record<string, EventHandler>;

		const aggregateVersion = aggregate.getVersion();
		const newVersion = aggregateVersion + 1;
		const uncommittedEvents = aggregate.getUncommittedEvents();

		await this.db.transaction().execute(async (trx) => {
			const version = await trx
				.updateTable(this.model.tableName)
				.set((eb) => ({
					version: eb.case().when('version', '=', aggregateVersion).then(newVersion).else(aggregateVersion).end(),
				}))
				.where('id', '=', aggregate.getId())
				.returning('version')
				.execute();

			if (version.length && version[0].version !== newVersion) {
				throw new ConflictError('Model version does not match what is stored in the database');
			}

			for (const event of uncommittedEvents) {
				const handlerName = `handle${event.constructor.name}`;
				const handler = handlerMap[handlerName];

				if (typeof handler !== 'function') {
					throw new Error(`Missing handler ${handlerName} in repository ${this.constructor.name}`);
				}

				await Promise.all([
					trx.insertInto(TableNames.EVENT_LOG).values({ eventName: event.constructor.name, data: event }).execute(),
					handler.call(this, event, trx),
				]);
			}
		});

		await this.eventBus.publishAll(uncommittedEvents);
		aggregate.commit();
	}
}
