interface ICategoriesRoutes {
	create: string;
	update: string;
	delete: string;
	getCategories: string;
}

const categoriesRoot = `/categories`;
const CategoryRoutes: { root: string; v1: ICategoriesRoutes } = {
	root: categoriesRoot,
	v1: {
		create: `${categoriesRoot}/`,
		getCategories: `${categoriesRoot}/`,
		update: `${categoriesRoot}/:id`,
		delete: `${categoriesRoot}/:id`,
	},
};

interface IUsersRoutes {
	getUsers: string;
	getUser: string;
	update: string;
}

const usersRoot = `/users`;
const UserRoutes: { root: string; v1: IUsersRoutes } = {
	root: usersRoot,
	v1: {
		getUsers: `${usersRoot}/`,
		getUser: `${usersRoot}/:id`,
		update: `${usersRoot}/:id`,
	},
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
	CATEGORIES: CategoryRoutes,
};
