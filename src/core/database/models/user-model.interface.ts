import { IUser } from '@app/core';

export abstract class IUserModel implements IUser {
  id: string;

  email: string;

  updatedAt: Date;

  createdAt: Date;

  version: number;
}
