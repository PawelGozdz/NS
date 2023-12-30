import { BaseModel } from '@libs/ddd';

import { EntityId, IAuthUser } from '@libs/common';

export class AuthUserModel extends BaseModel {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt?: string | null;

	createdAt: Date;
	updatedAt: Date;

	lastLogin: Date | null;
	tokenRefreshedAt: Date | null;

	static tableName = 'auth_users';

	static relationMappings = {};
}

export class AuthUser implements IAuthUser {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt: string | null;
	lastLogin: Date | null;
	tokenRefreshedAt: Date | null;

	constructor({
		hash,
		hashedRt,
		userId,
		email,
		id,
		tokenRefreshedAt,
		lastLogin,
	}: {
		hash: string;
		hashedRt: string | null;
		userId: string;
		email: string;
		id: string;
		tokenRefreshedAt: Date | null;
		lastLogin: Date | null;
	}) {
		this.id = id;
		this.hash = hash;
		this.email = email;
		this.hashedRt = hashedRt ?? null;
		this.userId = userId;
		this.tokenRefreshedAt = tokenRefreshedAt;
		this.lastLogin = lastLogin;
	}

	static create({
		id,
		userId,
		hash,
		hashedRt,
		email,
		lastLogin,
		tokenRefreshedAt,
	}: {
		id?: string;
		userId: string;
		email: string;
		hash: string;
		hashedRt?: string | null;
		tokenRefreshedAt?: Date | null;
		lastLogin?: Date | null;
	}) {
		return new AuthUser({
			id: id ? EntityId.create(id).value : EntityId.createRandom().value,
			email,
			userId: EntityId.create(userId).value,
			hash,
			hashedRt: hashedRt ?? null,
			lastLogin: lastLogin ?? null,
			tokenRefreshedAt: tokenRefreshedAt ?? null,
		});
	}
}
