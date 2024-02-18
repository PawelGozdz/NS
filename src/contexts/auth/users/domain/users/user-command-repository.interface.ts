import { EntityId } from '@libs/common';

import { User } from './user.aggregate-root';

export abstract class IUsersCommandRepository {
	abstract save(user: User): Promise<void>;
	abstract getOneById(id: EntityId): Promise<User | undefined>;
	abstract getOneByEmail(email: string): Promise<User | undefined>;
}
