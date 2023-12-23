import { BaseModel } from '@libs/ddd';

import { EntityId, IAuthUser } from '@libs/common';

export class AuthUserDao extends BaseModel {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt?: string | null;

	createdAt: Date;
	updatedAt: Date;

	static tableName = 'auth-users';

	static relationMappings = {};
}

export class AuthUser implements Pick<IAuthUser, 'hash' | 'hashedRt'> {
	id: EntityId;
	email: string;
	userId: EntityId;
	hash: string;
	hashedRt: string | null;

	constructor({ hash, hashedRt, userId, email, id }: AuthUser) {
		this.id = id;
		this.hash = hash;
		this.email = email;
		this.hashedRt = hashedRt ?? null;
		this.userId = userId;
	}

	static create({ id, userId, hash, hashedRt, email }: { id?: string; userId: string; email: string; hash: string; hashedRt?: string | null }) {
		return new AuthUser({
			id: id ? EntityId.create(id) : EntityId.createRandom(),
			email,
			userId: EntityId.create(userId),
			hash,
			hashedRt: hashedRt ?? null,
		});
	}
}
