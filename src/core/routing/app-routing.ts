import { v1 } from '@config/app';

const appRoot = '';

const UserRoutes: { [key: string]: any } = {};
const userVersionV1 = 'v1';
UserRoutes.root = `${appRoot}/users`;
UserRoutes[userVersionV1] = {
	getUsers: `${userVersionV1}/`,
};

const AuthRoutes: { [key: string]: any } = {};
AuthRoutes.root = `${appRoot}/auth`;
AuthRoutes[v1] = {
	signup: `/signup`,
	signin: `/signin`,
	logout: `/logout`,
	refresh: `/refresh`,
};

export const AppRoutes = {
	USERS: UserRoutes,
	AUTH: AuthRoutes,
};
