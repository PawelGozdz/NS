import { IUsersCommandRepository, User, UserCreatedEvent, UserSnapshot } from '@app/services/users/domain';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';
import { Inject, Injectable } from '@nestjs/common';
import { Transaction } from 'objection';
import { UserModel } from '../../models';

@Injectable()
export class UsersCommandRepository extends EntityRepository implements IUsersCommandRepository {
	constructor(
		eventBus: EventBus,
		@Inject(UserModel) readonly userModel: typeof UserModel,
	) {
		super(eventBus, userModel);
	}

	async getOneById(id: EntityId): Promise<User | undefined> {
		const user = await this.userModel.query().findById(id.value);

		if (!user) {
			return undefined;
		}

		const snapshot = this.userToSnapshot(user);

		return User.restoreFromSnapshot(snapshot);
	}

	async getOneByEmail(email: string): Promise<User | undefined> {
		const user = await this.userModel.query().findOne({ email });

		if (!user) {
			return undefined;
		}

		const snapshot = this.userToSnapshot(user);

		return User.restoreFromSnapshot(snapshot);
	}

	public save(user: User): Promise<void> {
		return this.handleUncommittedEvents(user);
	}

	private userToSnapshot(userModel: UserModel): UserSnapshot {
		return {
			email: userModel.email,
			id: userModel.id,
			version: userModel.version,
		};
	}

	public async handleUserCreatedEvent(event: UserCreatedEvent, trx: Transaction) {
		await this.userModel.query(trx).insert({
			id: event.id.value,
			email: event.email,
		});
	}
}
