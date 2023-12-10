import { IUsersQueryRepository, UserInfo } from '@app/services/identity/domain';
import { EntityId } from '@libs/common';

export class UsersQueryRepository implements IUsersQueryRepository {
	public async getOneById(id: EntityId): Promise<UserInfo | undefined> {
		return {
			id: id.value,
			email: 'test@test.com',
			roleId: 'roleId',
			hash: 'hash',
			hashedRt: 'hashedRt',
		};
	}

	public async getOneByEmail(email: string): Promise<UserInfo | undefined> {
		return {
			id: 'some-id',
			email: email,
			roleId: 'roleId',
			hash: 'hash',
			hashedRt: 'hashedRt',
		};
	}
}
