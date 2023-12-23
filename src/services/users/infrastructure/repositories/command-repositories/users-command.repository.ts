import { IUsersCommandRepository, User } from '@app/services/users/domain';
import { EntityId } from '@libs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersCommandRepository implements IUsersCommandRepository {
	constructor() {}
	async getOneById(id: EntityId): Promise<User | undefined> {
		return User.create({ id, email: 'test@test.com' });
	}

	async save(user: User): Promise<void> {}
}
