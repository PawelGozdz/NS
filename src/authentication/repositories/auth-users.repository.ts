import { EntityId } from '@libs/common';

import { Injectable } from '@nestjs/common';
import { AuthUser, AuthUserDao } from '../models';
import { IAuthUsersRepository } from './auth-users-repository.interface';

@Injectable()
export class AuthUsersRepository implements IAuthUsersRepository {
	async create(user: AuthUser): Promise<{ id: string }> {
		return {
			id: user.id.value,
		};
	}
	async update(user: AuthUser): Promise<void> {}
	async delete(userId: EntityId): Promise<void> {}
	async getByUserId(userId: EntityId): Promise<AuthUser | undefined> {
		return this.mapResponse({
			id: '6a0ee9ee-a36d-45c6-b264-1f06bf144b9a',
			email: 'email@email.com',
			userId: userId.value,
			hash: '$argon2id$v=19$m=65536,t=6,p=4$BlQGwDIOfelyoqJPYzP+Sw$X+4peb4YMalUd7C4cKBr0NVIw3tCjzk3IR8ACcwpN/o',
			hashedRt: null,
		} as AuthUserDao);
	}
	async getByUserEmail(email: string): Promise<AuthUser | undefined> {
		return this.mapResponse({
			id: '6a0ee9ee-a36d-45c6-b264-1f06bf144b9a',
			email: email,
			userId: '6a0ee9ee-a36d-45c6-b264-1f06bf144b9f',
			hash: '$argon2id$v=19$m=65536,t=6,p=4$BlQGwDIOfelyoqJPYzP+Sw$X+4peb4YMalUd7C4cKBr0NVIw3tCjzk3IR8ACcwpN/o',
			hashedRt: null,
		} as AuthUserDao);
	}

	mapResponse(user: AuthUserDao) {
		return AuthUser.create({
			id: user.id,
			email: user.email,
			userId: user.userId,
			hash: user.hash,
			hashedRt: user.hashedRt,
		});
	}
}
