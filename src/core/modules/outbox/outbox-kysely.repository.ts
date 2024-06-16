import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';

import { IDatabaseModels, IOutboxInput, TableNames } from '@app/core';

import { IOutboxRepository } from './outbox-repository.interface';
import { Outbox, OutboxModel } from './outbox.model';

export class OutboxKyselyRepository implements IOutboxRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>) {}

  async store(outboxInput: IOutboxInput) {
    await this.txHost.tx
      .insertInto(TableNames.OUTBOX)
      .values({
        eventName: outboxInput.eventName,
        context: outboxInput.context,
        payload: outboxInput.payload,
      } as OutboxModel)
      .execute();
  }

  async findUnpublished(limit?: number) {
    let query = this.txHost.tx.selectFrom(TableNames.OUTBOX).where('publishedOn', '=', null);

    if (typeof limit === 'number') {
      query = query.limit(limit);
    }

    const entities = (await query.execute()) as OutboxModel[];

    return entities.map(this.mapResponse);
  }

  mapResponse(outbox: OutboxModel) {
    return Outbox.create({
      id: outbox.id,
      eventName: outbox.eventName,
      context: outbox.context,
      payload: outbox.payload,
      createdAt: outbox.createdAt,
      publishedOn: outbox.publishedOn,
    });
  }
}
