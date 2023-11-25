import { createMock } from '@golevelup/ts-jest';
import { CqrsModule, EventBus, IEvent } from '@libs/cqrs';
import { AggregateRoot, BaseModel } from '@libs/ddd';
import { FunctionMock, catchActError } from '@libs/testing';
import { Injectable } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Knex } from 'knex';
import { Transaction } from 'objection';
import { EntityRepository, EventHandler } from './entity.repository';

class Entity extends AggregateRoot {
	getId(): string {
		return '1234';
	}
}
class DomainEvent implements IEvent {}

const trx = createMock<Transaction>();
const insertMock = jest.fn();
class ModelMock extends BaseModel {
	static transaction = async <T>(callback: (trx: Transaction) => Promise<T>) => {
		await callback(trx);
	};

	static knex() {
		return {
			table: () => {
				return {
					insert: insertMock,
				};
			},
		} as unknown as Knex;
	}
}

@Injectable()
class RepositoryMock extends EntityRepository {
	constructor(eventBus: EventBus) {
		super(eventBus, ModelMock);
	}

	save(entity: Entity) {
		return this.handleUncommittedEvents(entity);
	}

	handleDomainEvent = jest.fn() as FunctionMock<EventHandler>;
}

describe('EntityRepository', () => {
	let entity: Entity;
	let repository: RepositoryMock;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			providers: [RepositoryMock],
			imports: [CqrsModule],
		}).compile();

		repository = app.get<RepositoryMock>(RepositoryMock);

		entity = new Entity(0);
	});

	afterEach(() => {
		trx.raw.mockReset();
		trx.rollback.mockReset();
		insertMock.mockReset();
	});

	it('should call event handler method for aggregate event', async () => {
		// arrange
		trx.raw.mockResolvedValueOnce({ rows: [] });
		const event = new DomainEvent();
		entity.apply(event);

		// act
		await repository.save(entity);

		// assert
		expect(repository.handleDomainEvent).toBeCalledTimes(1);
		expect(repository.handleDomainEvent).toBeCalledWith(event, trx);
		expect(trx.table('event_log').insert).toHaveBeenCalledWith({
			data: expect.any(DomainEvent),
			eventName: DomainEvent.name,
		});
	});

	it('should rollback changes update version was failed', async () => {
		// arrange
		trx.raw.mockResolvedValueOnce({ rows: [{ version: 2 }] });
		const event = new DomainEvent();
		entity.apply(event);

		// act
		await repository.save(entity);

		// assert
		expect(trx.rollback).toBeCalledTimes(1);
	});

	it('should return error when event handler is not found', async () => {
		// arrange
		trx.raw.mockResolvedValueOnce({ rows: [{ version: 1 }] });
		class MissingHandlerDomainEvent implements IEvent {}

		const event = new MissingHandlerDomainEvent();

		entity.apply(event);

		// act
		const { error } = await catchActError(() => repository.save(entity));

		// assert
		expect(error).toBeDefined();
	});
});
