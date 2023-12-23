import { EntityId } from '@libs/common';

import { AuthUser } from '../models';

export abstract class IAuthUsersRepository {
	abstract create(user: AuthUser): Promise<{ id: string }>;
	abstract update(user: Partial<AuthUser>): Promise<void>;
	abstract delete(userId: EntityId): Promise<void>;
	abstract getByUserId(id: EntityId): Promise<AuthUser | undefined>;
	abstract getByUserEmail(email: string): Promise<AuthUser | undefined>;
}
