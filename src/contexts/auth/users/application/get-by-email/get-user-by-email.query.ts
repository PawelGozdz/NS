import { Query } from '@libs/cqrs';

import { UserInfo } from '../../domain';

export class GetUserByEmailQuery extends Query<GetUserByEmailQuery, GetUserByEmailQueryResult> {
	email: string;

	constructor(command: GetUserByEmailQuery) {
		super(command);

		Object.assign(this, command);
	}
}

export type GetUserByEmailQueryResult = UserInfo;
