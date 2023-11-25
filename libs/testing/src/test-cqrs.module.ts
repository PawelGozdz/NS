import { createMock } from '@golevelup/ts-jest';
import { CommandBus, ICommandBus, IQueryBus, QueryBus } from '@libs/cqrs';
import { Module } from '@nestjs/common';

export type QueryBusMock = jest.Mocked<IQueryBus>;
export type CommandBusMock = jest.Mocked<ICommandBus>;

@Module({
	providers: [
		{
			provide: QueryBus,
			useFactory: createMock,
		},
		{
			provide: CommandBus,
			useFactory: createMock,
		},
	],
	exports: [CommandBus, QueryBus],
})
export class TestCqrsModule {}
