import { Address, CountryCode, PhoneNumber } from '@app/core';
import { EntityId } from '@libs/common';

import { Company } from './company.aggregate-root';

export class CompanyAggregateRootFixtureFactory {
  public static create(overrides?: {
    id?: EntityId;
    name?: string;
    address?: Address | null;
    contactEmail?: string | null;
    contactPhone?: PhoneNumber | null;
    createdAt?: Date;
    updatedAt?: Date;
  }): Company {
    const id = overrides?.id ?? new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3a');
    const name = overrides?.name ?? 'Company Name';
    const address =
      overrides?.address ??
      Address.create({
        street: 'Mickewicza',
        city: 'Elk',
        countryCode: CountryCode.Poland,
        streetNumber: '15',
        postalCode: '31-230',
      });
    const contactEmail = overrides?.contactEmail ?? '';
    const contactPhone =
      overrides?.contactPhone ??
      PhoneNumber.create({
        countryCode: CountryCode.Poland,
        number: '510510510',
      });

    return new Company({
      id,
      name,
      address,
      contactEmail,
      contactPhone,
    });
  }
}
