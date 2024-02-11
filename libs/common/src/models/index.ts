import { IAuthUserModel } from './auth-user-model.interface';
import { IProfileModel } from './profile-model.interface';
import { IUserModel } from './user-model.interface';

export * from './auth-user-model.interface';
export * from './profile-model.interface';
export * from './user-model.interface';

export type IDatabaseModels = {
	authUsers: IAuthUserModel;
	users: IUserModel;
	profiles: IProfileModel;
};
