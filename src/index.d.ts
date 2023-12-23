import { IAuthUser, IUser } from '@libs/common';

declare global {
	namespace Express {
		interface Request {
			authUser?: IAuthUser;
			user?: IUser;
			refresh_token?: string;
		}
	}
}
