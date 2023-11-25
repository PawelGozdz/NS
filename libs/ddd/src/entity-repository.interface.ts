import { EntityId } from '@libs/common';
import { AggregateRoot, IEvent } from '@libs/cqrs';
import { Transaction } from 'objection';

type AggregateEvents = { [handlerName: string]: new (...args: any[]) => IEvent };

export type IEntityRepository<T extends AggregateEvents> = {
	[K in keyof T as `handle${K & string}`]: (event: InstanceType<T[K]>, trx: Transaction) => Promise<void>;
};

export abstract class IRepository<TAggregateRoot extends AggregateRoot> {
	abstract save(member: TAggregateRoot): Promise<void>;
	abstract getById(id: EntityId): Promise<TAggregateRoot | undefined>;
}
