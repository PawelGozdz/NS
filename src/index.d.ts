import { IAuthUser } from '@libs/common';

declare global {
	namespace Express {
		interface Request {
			user?: IAuthUser;
			refresh_token?: string;
		}
	}
}
