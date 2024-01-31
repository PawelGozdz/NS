const UserRoutes: { [key: string]: any } = {};

UserRoutes.root = `/users`;
UserRoutes.v1 = {
	getUsers: `${UserRoutes.root}/`,
};

interface IAuthRoutes {
	signup: string;
	signin: string;
	logout: string;
	refresh: string;
}

const authRoot = `auth`;
const AuthRoutes: { root: string; v1: IAuthRoutes } = {
	root: authRoot,
	v1: {
		signup: `/${authRoot}/signup`,
		signin: `/${authRoot}/signin`,
		logout: `/${authRoot}/logout`,
		refresh: `/${authRoot}/refresh`,
	},
};

export const AppRoutes = {
	USERS: UserRoutes,
	AUTH: AuthRoutes,
};
