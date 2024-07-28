/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Transaction } from 'kysely';
import { omit } from 'lodash';

import { ConflictError } from '@libs/common';
import { EventBus, IEvent } from '@libs/cqrs';
import { AggregateRoot, BaseModel } from '@libs/ddd';

export type EventHandler = <T>(event: IEvent, trx?: Transaction<T>) => Promise<void> | void;

const eventLogTableName = 'eventLogs';

export abstract class EntityRepository {
  protected constructor(
    private readonly eventBus: EventBus,
    protected model: typeof BaseModel,
    protected db: TransactionHost<TransactionalAdapterKysely<any>>,
  ) {}

  protected async handleUncommittedEvents(aggregate: AggregateRoot) {
    const handlerMap = this as unknown as Record<string, EventHandler>;

    const aggregateVersion = aggregate.getVersion();
    const newVersion = aggregateVersion + 1;
    const uncommittedEvents = aggregate.getUncommittedEvents();

    const version = await this.db.tx
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

      const { actor } = event as any;
      const noActorEvent = omit(event, 'actor');

      Promise.all([
        this.db.tx.insertInto(eventLogTableName).values({ eventName: noActorEvent.constructor.name, data: noActorEvent, actor }).execute(),
        handler.call(this, noActorEvent),
      ]);
    }

    await this.eventBus.publishAll(uncommittedEvents);
    aggregate.commit();
  }
}
