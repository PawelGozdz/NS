export interface IUserBase {
	id: string;
}

export interface IUser extends IUserBase {
	email: string;
	roleId: string;
	hash: string;
	hashedRt: string | null;
}
