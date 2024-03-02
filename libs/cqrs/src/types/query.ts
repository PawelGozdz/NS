/* eslint-disable @typescript-eslint/no-unused-vars */
import { IQuery } from '@nestjs/cqrs';

export class QueryBase<T> implements IQuery {}

export declare type QueryResult<QueryT extends QueryBase<unknown>> = QueryT extends QueryBase<infer ResultT> ? ResultT : never;

export class Query<TQuery, TResponse> extends QueryBase<TResponse> {
  constructor(query: Omit<TQuery, keyof QueryBase<TResponse>>) {
    super();

    Object.assign(this, query);
  }
}
