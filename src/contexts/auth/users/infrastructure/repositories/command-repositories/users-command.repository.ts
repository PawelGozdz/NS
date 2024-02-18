import { Database, TableNames } from '@app/database';
import { EntityId } from '@libs/common';
import { EventBus } from '@libs/cqrs';
import { EntityRepository } from '@libs/ddd';
import { Injectable } from '@nestjs/common';
import { Transaction } from 'kysely';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { IUsersCommandRepository, User, UserCreatedEvent, UserSnapshot } from '../../../domain';
import { UserModel } from '../../models';

@Injectable()
export class UsersCommandRepository extends EntityRepository implements IUsersCommandRepository {
	constructor(
		eventBus: EventBus,
		readonly db: Database,
	) {
		super(eventBus, UserModel, db);
	}

	async getOneById(id: EntityId): Promise<User | undefined> {
		const user = (await this.getUserAndProfile().where('u.id', '=', id.value).executeTakeFirst()) as UserModel | undefined;

		if (!user) {
			return undefined;
		}

		const snapshot = this.userToSnapshot(user);

		return User.restoreFromSnapshot(snapshot);
	}

	async getOneByEmail(email: string): Promise<User | undefined> {
		const user = (await this.getUserAndProfile().where('u.email', '=', email).executeTakeFirst()) as UserModel | undefined;

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
			profile: {
				id: userModel.profile.id,
				userId: userModel.profile.userId,
				firstName: userModel.profile.firstName,
				lastName: userModel.profile.lastName,
				username: userModel.profile.username,
				address: userModel.profile.address,
				gender: userModel.profile.gender,
				bio: userModel.profile.bio,
				dateOfBirth: userModel.profile.dateOfBirth,
				hobbies: userModel.profile?.hobbies || [],
				languages: userModel.profile?.languages || [],
				phoneNumber: userModel.profile.phoneNumber,
				profilePicture: userModel.profile.profilePicture,
				rodoAcceptanceDate: userModel.profile.rodoAcceptanceDate,
			},
			version: userModel.version,
		};
	}

	private getUserAndProfile() {
		return this.db
			.selectFrom(`${TableNames.USERS} as u`)
			.select((eb) => [
				'u.id',
				'u.email',
				'u.version',
				'u.createdAt',
				'u.updatedAt',
				jsonObjectFrom(
					eb
						.selectFrom(`${TableNames.USER_PROFILES} as p`)
						.select([
							'p.id',
							'p.userId',
							'p.firstName',
							'p.lastName',
							'p.username',
							'p.bio',
							'p.address',
							'p.dateOfBirth',
							'p.gender',
							'p.hobbies',
							'p.languages',
							'p.phoneNumber',
							'p.profilePicture',
							'p.rodoAcceptanceDate',
							'p.createdAt',
							'p.updatedAt',
						])
						.whereRef('p.userId', '=', 'u.id'),
				).as('profile'),
			]);
	}

	public async handleUserUpdatedEvent(event: UserCreatedEvent, trx: Transaction<any>) {
		await trx
			.updateTable(TableNames.USERS)
			.set({
				email: event.email,
			})
			.where('id', '=', event.id.value)
			.executeTakeFirstOrThrow();

		await trx
			.updateTable(TableNames.USER_PROFILES)
			.set({
				firstName: event.profile.firstName,
				lastName: event.profile.lastName,
				username: event.profile.username,
				address: event.profile.address,
				bio: event.profile.bio,
				dateOfBirth: event.profile.dateOfBirth,
				gender: event.profile.gender,
				hobbies: event.profile.hobbies,
				languages: event.profile.languages,
				phoneNumber: event.profile.phoneNumber,
				profilePicture: event.profile.profilePicture,
				rodoAcceptanceDate: event.profile.rodoAcceptanceDate,
			})
			.where('id', '=', event.profile.id.value)
			.where('userId', '=', event.profile.userId.value)
			.execute();
	}

	public async handleUserCreatedEvent(event: UserCreatedEvent, trx: Transaction<any>) {
		await trx.insertInto(TableNames.USERS).values({ id: event.id.value, email: event.email }).execute();
		await trx.insertInto(TableNames.USER_PROFILES).values({ id: event.profile.id.value, userId: event.profile.userId.value }).execute();
	}
}
