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

export class AuthUser implements IAuthUser {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt: string | null;

	constructor({ hash, hashedRt, userId, email, id }: { hash: string; hashedRt: string | null; userId: string; email: string; id: string }) {
		this.id = id;
		this.hash = hash;
		this.email = email;
		this.hashedRt = hashedRt ?? null;
		this.userId = userId;
	}

	static create({ id, userId, hash, hashedRt, email }: { id?: string; userId: string; email: string; hash: string; hashedRt?: string | null }) {
		return new AuthUser({
			id: id ? EntityId.create(id).value : EntityId.createRandom().value,
			email,
			userId: EntityId.create(userId).value,
			hash,
			hashedRt: hashedRt ?? null,
		});
	}
}
