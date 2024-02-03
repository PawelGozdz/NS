import { EntityId } from '@libs/common';

import { IUsersQueryRepository, UserInfo } from '../../../domain';

export class UsersQueryRepository implements IUsersQueryRepository {
	public async getOneById(id: EntityId): Promise<UserInfo | undefined> {
		return {
			id: id.value,
			email: 'test@test.com',
		};
	}

	public async getOneByEmail(email: string): Promise<UserInfo | undefined> {
		return {
			id: 'b83c6426-6863-4347-8356-d60e516fa3d3',
			email,
		};
	}
}
