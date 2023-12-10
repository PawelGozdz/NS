export type UserSnapshot = {
	id: string;
	email: string;
	roleId: string;
	hash: string;
	hashedRt: string | null;
	version: number;
};
