import { Kysely, Transaction } from 'kysely';

import { ConflictError } from '@libs/common';
import { EventBus, IEvent } from '@libs/cqrs';
import { AggregateRoot, BaseModel } from '@libs/ddd';

export type EventHandler = <T>(event: IEvent, trx: Transaction<T>) => Promise<void> | void;

const eventLogTableName = 'eventLogs';

export abstract class EntityRepository {
  protected constructor(
    private readonly eventBus: EventBus,
    protected model: typeof BaseModel,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

      // eslint-disable-next-line no-restricted-syntax
      for (const event of uncommittedEvents) {
        const handlerName = `handle${event.constructor.name}`;
        const handler = handlerMap[handlerName];

        if (typeof handler !== 'function') {
          throw new Error(`Missing handler ${handlerName} in repository ${this.constructor.name}`);
        }

        Promise.all([
          trx.insertInto(eventLogTableName).values({ eventName: event.constructor.name, data: event }).execute(),
          handler.call(this, event, trx),
        ]);
      }
    });

    await this.eventBus.publishAll(uncommittedEvents);
    aggregate.commit();
  }
}
