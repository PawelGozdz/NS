import { Database, TableNames } from '@app/database';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';

import { IUsersCommandRepository, User, UserCreatedEvent, UserSnapshot } from '../../../domain';
import { UserDao } from '../../models';

@Injectable()
export class UsersCommandRepository extends EntityRepository implements IUsersCommandRepository {
	constructor(
		eventBus: EventBus,
		readonly db: Database,
	) {
		super(eventBus, UserDao, db);
	}

	async getOneById(id: EntityId): Promise<User | undefined> {
		const user = await this.db.selectFrom(TableNames.USERS).selectAll().where('id', '=', id.value).executeTakeFirst();

		if (!user) {
			return undefined;
		}

		const snapshot = this.userToSnapshot(user);

		return User.restoreFromSnapshot(snapshot);
	}

	async getOneByEmail(email: string): Promise<User | undefined> {
		const user = await this.db.selectFrom(TableNames.USERS).selectAll().where('email', '=', email).executeTakeFirst();

		if (!user) {
			return undefined;
		}

		const snapshot = this.userToSnapshot(user);

		return User.restoreFromSnapshot(snapshot);
	}

	public save(user: User): Promise<void> {
		return this.handleUncommittedEvents(user);
	}

	private userToSnapshot(userModel: UserDao): UserSnapshot {
		return {
			email: userModel.email,
			id: userModel.id,
			version: userModel.version,
		};
	}

	public async handleUserCreatedEvent(event: UserCreatedEvent, trx: Transaction<any>) {
		await trx.insertInto(TableNames.USERS).values({ id: event.id.value, email: event.email }).execute();
	}
}
