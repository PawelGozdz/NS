import { ICommandHandler, IQueryHandler } from '@nestjs/cqrs';

import { CommandBase } from './command';
import { QueryBase } from './query';

export * from './command';
export * from './event';
export * from './query';

declare module '@nestjs/cqrs/dist/query-bus' {
  interface QueryBus {
    execute<X>(query: QueryBase<X>): Promise<X>;
  }
  type IInferredQueryHandler<QueryType extends QueryBase<unknown>> =
    QueryType extends QueryBase<infer ResultType> ? IQueryHandler<QueryType, ResultType> : never;
}
declare module '@nestjs/cqrs/dist/command-bus' {
  interface CommandBus {
    execute<X>(command: CommandBase<X>): Promise<X>;
  }
  type IInferredCommandHandler<CommandType extends CommandBase<unknown>> =
    CommandType extends CommandBase<infer ResultType> ? ICommandHandler<CommandType, ResultType> : never;
}
