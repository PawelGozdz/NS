import { MissingValueError } from '@libs/common';

import { CountryCode } from '../enums';

type CompareAddressValue = {
  street: string;
  streetNumber: string | undefined;
  city: string;
  countryCode: CountryCode;
  postalCode: string;
};

export type AddressData = {
  street: string;
  streetNumber?: string | undefined;
  city: string;
  countryCode: CountryCode;
  postalCode: string;
};

export class Address {
  public constructor(
    readonly street: string,
    readonly streetNumber: string | undefined,
    readonly city: string,
    readonly countryCode: CountryCode,
    readonly postalCode: string,
  ) {}

  public static create({ street, streetNumber, city, countryCode, postalCode }: Partial<AddressData>): Address {
    if (!street) {
      throw new MissingValueError('Address.street');
    }

    if (street.search(/[0-9]/) === -1 && !streetNumber) {
      throw new MissingValueError('Address.streetNumber must be present if Address.street doesnt contain numbers');
    }

    if (!city) {
      throw new MissingValueError('Address.city');
    }

    if (countryCode == null) {
      throw new MissingValueError('Address.countryCode');
    }

    if (!postalCode) {
      throw new MissingValueError('Address.postalCode');
    }

    return new Address(street.trim(), streetNumber?.trim(), city.trim(), countryCode, postalCode.trim());
  }

  equals(address: Address): boolean {
    return this.compareAddress(address, this);
  }

  private compareAddress(address1: CompareAddressValue, address2: CompareAddressValue): boolean {
    const streetNumberIsEqual =
      !!address1.streetNumber === !!address2.streetNumber &&
      (!address2.streetNumber || (!!address2.streetNumber && address2.streetNumber?.toLowerCase() === address1.streetNumber?.toLowerCase()));

    return (
      address2.street.toLowerCase() === address1.street.toLowerCase() &&
      address2.city.toLowerCase() === address1.city.toLowerCase() &&
      address2.postalCode.toLowerCase() === address1.postalCode.toLowerCase() &&
      address2.countryCode === address1.countryCode &&
      streetNumberIsEqual
    );
  }

  public toJSON(): AddressData {
    return {
      street: this.street,
      streetNumber: this.streetNumber,
      city: this.city,
      countryCode: this.countryCode,
      postalCode: this.postalCode,
    };
  }
}
