export abstract class IAuthUserModel {
	id: string;
	email: string;
	userId: string;
	hash: string;
	hashedRt: string | null;

	lastLogin: Date | null;
	tokenRefreshedAt: Date | null;

	createdAt: Date;
	updatedAt: Date;
}
