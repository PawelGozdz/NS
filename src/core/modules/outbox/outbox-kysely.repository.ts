import { TableNames } from '@app/database';
import { Kysely } from 'kysely';
import { IOutboxRepository } from './outbox-repository.interface';
import { Outbox, OutboxModel } from './outbox.model';
import { IOutboxInput } from './types';

export class OutboxKyselyRepository implements IOutboxRepository {
	constructor(private readonly db: Kysely<any>) {}

	async store(outboxInput: IOutboxInput) {
		await this.withTransaction().execute(async (trx) => {
			trx.insertInto(TableNames.EVENT_LOG).values({ eventName: outboxInput.eventName, data: outboxInput.payload }).execute();
			trx.insertInto(TableNames.OUTBOX).values({ eventName: outboxInput.eventName, ctx: outboxInput.ctx, data: outboxInput.payload }).execute();
		});
	}

	async findUnpublished(limit?: number) {
		let query = this.db.selectFrom(TableNames.OUTBOX).where('publishedOn', '=', null);

		if (limit) {
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
