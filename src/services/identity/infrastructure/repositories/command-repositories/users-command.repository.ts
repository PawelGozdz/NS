import { IUsersCommandRepository, User } from '@app/services/identity/domain';
import { EntityId } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersCommandRepository implements IUsersCommandRepository {
	constructor() {}
	async getOneById(id: EntityId): Promise<User | undefined> {
		return User.create({ id: id, hash: 'hash', hashedRt: 'hashedRt', email: 'test@test.com', roleId: EntityId.createRandom() });
	}

	async save(user: User): Promise<void> {}
}
