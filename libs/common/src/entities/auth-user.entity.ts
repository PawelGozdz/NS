export interface IAuthUser {
	userId: string;
	email: string;
	hash: string;
	hashedRt: string | null;
	id: string;
}
