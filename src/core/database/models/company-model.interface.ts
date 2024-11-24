import { Address, PhoneNumber } from '@app/core';

export abstract class ICompanyModel {
  id: string;

  name: string;

  address: Address | null;

  email: string | null;

  phoneNumber: PhoneNumber | null;

  createdAt: Date;

  updatedAt: Date;

  version: number;
}
