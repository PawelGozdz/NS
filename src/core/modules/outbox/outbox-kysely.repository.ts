import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterKysely } from '@nestjs-cls/transactional-adapter-kysely';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';

import { IDatabaseModels, IEventLogModel, IOutboxInput, TableNames } from '@app/core';

import { IOutboxRepository } from './outbox-repository.interface';
import { Outbox, OutboxModel } from './outbox.model';

@Injectable()
export class OutboxKyselyRepository implements IOutboxRepository {
  constructor(private readonly txHost: TransactionHost<TransactionalAdapterKysely<IDatabaseModels>>) {}

  async store(outboxInput: IOutboxInput) {
    const noActorOutboxInput = omit(outboxInput.data, 'actor');

    await Promise.all([
      this.txHost.tx
        .insertInto(TableNames.OUTBOX)
        .values({
          eventName: outboxInput.eventName,
          context: outboxInput.context,
          data: noActorOutboxInput,
        } as unknown as OutboxModel)
        .execute(),

      await this.txHost.tx
        .insertInto(TableNames.EVENT_LOG)
        .values({
          eventName: outboxInput.eventName,
          data: noActorOutboxInput,
          actor: outboxInput.data.actor,
        } as unknown as IEventLogModel)
        .execute(),
    ]);
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
      data: outbox.data,
      createdAt: outbox.createdAt,
      publishedOn: outbox.publishedOn,
    });
  }
}
