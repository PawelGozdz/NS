import { Inject, Injectable } from '@nestjs/common';
import { AuthUser, AuthUserModel } from '../models';
import { IAuthUsersRepository } from './auth-users-repository.interface';

@Injectable()
export class AuthUsersRepository implements IAuthUsersRepository {
	constructor(@Inject(AuthUserModel) readonly authUserModel: typeof AuthUserModel) {}

	async create(user: AuthUser): Promise<{ id: string }> {
		const userDao = await this.authUserModel.query().insert({
			id: user.id,
			email: user.email,
			userId: user.userId,
			hash: user.hash,
			hashedRt: user.hashedRt,
			lastLogin: user.lastLogin,
			tokenRefreshedAt: user.tokenRefreshedAt,
		});

		return { id: userDao.id };
	}

	async update(user: AuthUser): Promise<void> {
		await this.authUserModel.query().update(user);
	}

	async delete(userId: string): Promise<void> {}

	async getByUserId(userId: string): Promise<AuthUser | undefined> {
		const userDao = await this.authUserModel.query().findOne({
			userId,
		});

		if (!userDao) {
			return undefined;
		}

		return this.mapResponse(userDao);
	}
	async getByUserEmail(email: string): Promise<AuthUser | undefined> {
		const userDao = await this.authUserModel.query().findOne({
			email,
		});

		if (!userDao) {
			return undefined;
		}

		return this.mapResponse(userDao);
	}

	mapResponse(user: AuthUserModel): AuthUser {
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
