import { IUsersQueryParams } from '@app/core';
import { Database, TableNames } from '@app/database';
import { EntityId } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { jsonObjectFrom } from 'kysely/helpers/postgres';

import { IUsersQueryRepository, UserInfo } from '../../../domain';
import { UserModel } from '../../models';

@Injectable()
export class UsersQueryRepository implements IUsersQueryRepository {
	constructor(readonly db: Database) {}

	public async getOneById(id: EntityId): Promise<UserInfo | undefined> {
		const user = (await this.getUserAndProfile().where('id', '=', id.value).executeTakeFirst()) as UserModel | undefined;

		if (!user) {
			return undefined;
		}

		return this.userToUserInfo(user);
	}

	public async getOneByEmail(email: string): Promise<UserInfo | undefined> {
		const user = (await this.getUserAndProfile().where('email', '=', email).executeTakeFirst()) as UserModel | undefined;

		if (!user) {
			return undefined;
		}

		return this.userToUserInfo(user);
	}

	public async getMany({ _filter }: IUsersQueryParams): Promise<UserInfo[]> {
		let query = this.getUserAndProfile();

		if (_filter?.email) {
			query = query.where('u.email', '=', _filter.email);
		}

		if (_filter?.id) {
			query = query.where('u.id', '=', _filter.id);
		}

		const users = (await query.execute()) as UserModel[];

		return await users.map((user) => this.userToUserInfo(user));
	}

	private userToUserInfo(userModel: UserModel): UserInfo {
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
}
