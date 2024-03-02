/* eslint-disable no-restricted-imports */
import { EventsHandler, IEvent, IEventHandler } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import util from 'util';

import { catchActError } from '@libs/testing';

import { CqrsModule } from './cqrs.module';
import { EventBus } from './event-bus';

class DomainEvent implements IEvent {
  constructor(public shouldThrow = false) {}
}

const waitFor = util.promisify(setTimeout);

@EventsHandler(DomainEvent)
class TestEventHandler implements IEventHandler<DomainEvent> {
  publishedEvents: DomainEvent[] = [];

  async handle(event: DomainEvent) {
    await waitFor(10);

    this.publishedEvents.push(event);

    if (event.shouldThrow) {
      throw new Error('Test error');
    }
  }
}

describe('EventBus', () => {
  let app: TestingModule;
  let eventBus: EventBus;
  let handler: TestEventHandler;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [CqrsModule],
      providers: [TestEventHandler],
    }).compile();
    await app.init();

    eventBus = app.get(EventBus);
    handler = app.get(TestEventHandler);
  });

  afterEach(async () => {
    await app?.close();
  });

  it('should call event handler and properly await for event result', async () => {
    // arrange
    const event = new DomainEvent();

    // act
    await eventBus.publish(event);

    // assert
    expect(handler.publishedEvents).toEqual([event]);
  });

  it('should pass the rejected error back', async () => {
    // arrange
    const event = new DomainEvent(true);

    // act
    const { error } = await catchActError(() => eventBus.publish(event));

    // assert
    expect(error).toMatchInlineSnapshot('[Error: Test error]');
  });
});
