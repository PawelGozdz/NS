import { IAuthUserDao } from './auth-user-model.interface';
import { IUserDao } from './user-model.interface';

export * from './auth-user-model.interface';
export * from './user-model.interface';

export type IDatabaseDaos = {
	auth_users: IAuthUserDao;
	users: IUserDao;
};
