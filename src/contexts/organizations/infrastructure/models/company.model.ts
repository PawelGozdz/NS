import { Address, ICompanyModel, PhoneNumber, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class CompanyModel extends BaseModel implements ICompanyModel {
  id: string;

  name: string;

  address: Address | null;

  email: string | null;

  phoneNumber: PhoneNumber | null;

  updatedAt: Date;

  createdAt: Date;

  version: number;

  static tableName = TableNames.COMPANIES;
}
