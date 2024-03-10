import { Kysely } from 'kysely';

import { IDatabaseModels, IOutboxInput, TableNames } from '@app/core';

import { IOutboxRepository } from './outbox-repository.interface';
import { Outbox, OutboxModel } from './outbox.model';

export class OutboxKyselyRepository implements IOutboxRepository {
  constructor(private readonly db: Kysely<IDatabaseModels>) {}

  async store(outboxInput: IOutboxInput) {
    await this.withTransaction().execute(async (trx) => {
      //   trx.insertInto(TableNames.EVENT_LOG).values({ eventName: outboxInput.eventName, data: outboxInput.payload }).execute();
      trx
        .insertInto(TableNames.OUTBOX)
        .values({
          eventName: outboxInput.eventName,
          ctx: outboxInput.ctx,
          payload: outboxInput.payload,
        } as OutboxModel)
        .execute();
    });
  }

  async findUnpublished(limit?: number) {
    let query = this.db.selectFrom(TableNames.OUTBOX).where('publishedOn', '=', null);

    if (typeof limit === 'number') {
      query = query.limit(limit);
    }

    const entities = (await query.execute()) as OutboxModel[];

    return entities.map(this.mapResponse);
  }

  mapResponse(outbox: OutboxModel) {
    return new Outbox({
      id: outbox.id,
      eventName: outbox.eventName,
      ctx: outbox.ctx,
      payload: outbox.payload,
      createdAt: outbox.createdAt,
      publishedOn: outbox.publishedOn,
    });
  }

  withTransaction() {
    return this.db.transaction();
  }
}
