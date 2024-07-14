import { AddressData, IUsersQueryParams } from '@app/core';
import { EntityId } from '@libs/common';

export type UserInfo = {
  id: string;
  email: string;
  profile: {
    id: string;
    userId: string;
    firstName: string | null;
    lastName: string | null;
    username: string | null;
    address: AddressData | null;
    bio: string | null;
    gender: string | null;
    dateOfBirth: Date | null;
    hobbies: string[];
    languages: string[];
    phoneNumber: string | null;
    profilePicture: string | null;
    rodoAcceptanceDate: Date | null;
  };
};

export abstract class IUsersQueryRepository {
  abstract getOneById(id: EntityId): Promise<UserInfo | undefined>;

  abstract getOneByEmail(email: string): Promise<UserInfo | undefined>;

  abstract getMany(params?: IUsersQueryParams): Promise<UserInfo[]>;
}
