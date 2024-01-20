import { Database, TableNames } from '@app/database';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';
import { AuthUser, AuthUserDao } from '../models';
import { IAuthUsersRepository } from './auth-users-repository.interface';

@Injectable()
export class AuthUsersRepository implements IAuthUsersRepository {
	constructor(private readonly db: Database) {}

	async create(user: AuthUser): Promise<{ id: string }> {
		const now = dayjs().toDate();

		const userDao = await this.db
			.insertInto(TableNames.AUTH_USERS)
			.values({
				id: user.id,
				email: user.email,
				userId: user.userId,
				hash: user.hash,
				hashedRt: user.hashedRt,
				lastLogin: user.lastLogin,
				tokenRefreshedAt: user.tokenRefreshedAt,
				createdAt: now,
				updatedAt: now,
			})
			.returning('id')
			.executeTakeFirstOrThrow();

		return { id: userDao.id };
	}

	async update(user: AuthUser): Promise<void> {
		await this.db.updateTable(TableNames.AUTH_USERS).set(user).where('userId', '=', user.userId).execute();
	}

	async delete(userId: string): Promise<void> {}

	async getByUserId(userId: string): Promise<AuthUser | undefined> {
		const userDao = await this.db.selectFrom(TableNames.AUTH_USERS).selectAll().where('userId', '=', userId).executeTakeFirst();

		if (!userDao) {
			return undefined;
		}

		return this.mapResponse(userDao);
	}
	async getByUserEmail(email: string): Promise<AuthUser | undefined> {
		const userDao = await this.db.selectFrom(TableNames.AUTH_USERS).selectAll().where('email', '=', email).executeTakeFirst();

		if (!userDao) {
			return undefined;
		}

		return this.mapResponse(userDao);
	}

	mapResponse(user: AuthUserDao): AuthUser {
		return AuthUser.create({
			id: user.id,
			email: user.email,
			userId: user.userId,
			hash: user.hash,
			hashedRt: user.hashedRt,
			lastLogin: user.lastLogin,
			tokenRefreshedAt: user.tokenRefreshedAt,
		});
	}
}
