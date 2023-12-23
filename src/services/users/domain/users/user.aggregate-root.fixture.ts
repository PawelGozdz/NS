import { EntityId } from '@libs/common';
import { User } from './user.aggregate-root';

export class UserAggregateRootFixtureFactory {
	public static defaultFromDate = new Date('2021-10-20T16:00:00.000Z');
	public static defaultToDate = new Date('2021-10-27T16:00:00.000Z');

	public static create(overrides?: { id?: string; email?: string }): User {
		const userId = overrides?.id ? new EntityId(overrides.id) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3c');
		const email = overrides?.email ? overrides.email : 'test55@test.com';

		return new User({
			id: userId,
			email: email,
		});
	}
}
