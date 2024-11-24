import { CountryCode } from '@app/core';

export type CompanySnapshot = {
  id: string;
  name: string;
  address: {
    street: string;
    streetNumber: string | undefined;
    city: string;
    countryCode: CountryCode;
    postalCode: string;
  } | null;
  contactEmail: string | null;
  contactPhone: {
    number: string;
    countryCode: CountryCode;
  } | null;
  createdAt: Date;
  updatedAt: Date;
  version: number;
};
