import { IUserModel, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

import { UserProfileModel } from './profile.model';

export class UserModel extends BaseModel implements IUserModel {
  id: string;

  email: string;

  profile: UserProfileModel;

  updatedAt: Date;

  createdAt: Date;

  version: number;

  static tableName = TableNames.USERS;
}
