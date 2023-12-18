import { EntityId } from '@libs/common';
import { User } from './user.aggregate-root';

export class UserAggregateRootFixtureFactory {
	public static defaultFromDate = new Date('2021-10-20T16:00:00.000Z');
	public static defaultToDate = new Date('2021-10-27T16:00:00.000Z');

	public static create(overrides?: { id?: string; roleId?: string; hash?: string; hashedRt?: string; email?: string }): User {
		const userId = overrides?.id ? new EntityId(overrides.id) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3c');
		const roleId = overrides?.roleId ? new EntityId(overrides.roleId) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba00');
		const email = overrides?.email ? overrides.email : 'test55@test.com';
		const hash = overrides?.hash ? overrides.hash : 'hashed-password';
		const hashedRt = overrides?.hashedRt ? overrides.hashedRt : 'hashed-rt';

		return new User({
			id: userId,
			roleId: roleId,
			email: email,
			hash: hash,
			hashedRt: hashedRt,
		});
	}
}
