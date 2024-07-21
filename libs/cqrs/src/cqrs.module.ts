import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { CommandBus, IEvent, QueryBus } from '@nestjs/cqrs';
import { ExplorerService } from '@nestjs/cqrs/dist/services/explorer.service';

import { EventBus } from './event-bus';
import { EventPublisher } from './event-publisher';

@Module({
  providers: [CommandBus, QueryBus, EventBus, EventPublisher, ExplorerService],
  exports: [CommandBus, QueryBus, EventBus, EventPublisher],
})
export class CqrsModule<EventBase extends IEvent = IEvent> implements OnApplicationBootstrap {
  constructor(
    private readonly explorerService: ExplorerService<EventBase>,
    private readonly eventsBus: EventBus<EventBase>,
    private readonly commandsBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  onApplicationBootstrap() {
    const { events, queries, commands } = this.explorerService.explore();

    this.eventsBus.register(events);
    this.commandsBus.register(commands);
    this.queryBus.register(queries);
  }
}
