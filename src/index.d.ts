import { IAuthUser, IUser } from '@libs/common';

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
      userData?: IUser;
      refreshToken?: string;
    }
  }
}
