import { IUser } from '@libs/common';

declare global {
	namespace Express {
		interface Request {
			user?: IUser;
			refresh_token?: string;
		}
	}
}
