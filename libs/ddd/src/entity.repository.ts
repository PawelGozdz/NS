/* eslint-disable no-await-in-loop */
import { ConflictError } from '@libs/common';
import { EventBus, IEvent } from '@libs/cqrs';
import { AggregateRoot, BaseModel } from '@libs/ddd';
import { Transaction } from 'objection';

export type EventHandler = (event: IEvent, trx: Transaction) => Promise<void> | void;

export abstract class EntityRepository {
	protected constructor(
		private eventBus: EventBus,
		protected model: typeof BaseModel,
	) {}

	protected async handleUncommittedEvents(aggregate: AggregateRoot) {
		const handlerMap = this as unknown as Record<string, EventHandler>;

		const aggregateVersion = aggregate.getVersion();
		const newVersion = aggregateVersion + 1;
		const uncommittedEvents = aggregate.getUncommittedEvents();

		await this.model.transaction(async (trx) => {
			const version: { rows: Record<string, { version: number }> } = await trx.raw(
				`UPDATE :tableName:
					SET version = CASE
						WHEN version = :aggregateVersion THEN :newVersion
						ELSE :aggregateVersion:
					END
					WHERE id = :id
				RETURNING (version)`,
				{
					tableName: this.model.tableName,
					aggregateVersion,
					newVersion,
					id: aggregate.getId(),
				},
			);

			if (version.rows.length && version.rows[0].version !== newVersion) {
				await trx.rollback(new ConflictError('Model version does not match what is stored in the database'));
			}

			for (const event of uncommittedEvents) {
				const handlerName = `handle${event.constructor.name}`;
				const handler = handlerMap[handlerName];

				if (typeof handler !== 'function') {
					throw new Error(`Missing handler ${handlerName} in repository ${this.constructor.name}`);
				}

				await Promise.all([trx.table('event_log').insert({ eventName: event.constructor.name, data: event }), handler.call(this, event, trx)]);
			}
		});

		await this.eventBus.publishAll(uncommittedEvents);
		aggregate.commit();
	}
}
