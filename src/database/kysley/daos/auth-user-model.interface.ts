export abstract class IAuthUserDao {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt?: string | null;

	createdAt: Date;
	updatedAt: Date;

	lastLogin: Date | null;
	tokenRefreshedAt: Date | null;
}
