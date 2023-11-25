// eslint-disable-next-line no-restricted-imports
import { Query as QueryBase } from '@nestjs-architects/typed-cqrs';

export class Query<TQuery, TResponse> extends QueryBase<TResponse> {
	constructor(query: Omit<TQuery, keyof QueryBase<TResponse>>) {
		super();

		Object.assign(this, query);
	}
}
