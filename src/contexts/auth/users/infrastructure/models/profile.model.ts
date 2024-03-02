import { TableNames } from '@app/core';
import { Address, IUserProfileModel } from '@libs/common';
import { BaseModel } from '@libs/ddd';

export class UserProfileModel extends BaseModel implements IUserProfileModel {
  id: string;

  userId: string;

  firstName: string | null;

  lastName: string | null;

  username: string | null;

  address: Address | null;

  bio: string | null;

  dateOfBirth: Date | null;

  gender: string | null;

  hobbies: string[];

  languages: string[];

  phoneNumber: string | null;

  profilePicture: string | null;

  rodoAcceptanceDate: Date | null;

  updatedAt: Date;

  createdAt: Date;

  static tableName = TableNames.USER_PROFILES;
}
