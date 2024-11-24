import { CountryCode as CountryCodeType, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

import { InvalidParameterError } from '@libs/common';

import { CountryCode } from '../enums';

export type PhoneNumberData = {
  number: string;
  countryCode: CountryCode;
};

export interface IPhoneNumber {
  number: string;
  countryCode: CountryCode;
}

export class PhoneNumber {
  public readonly number: string;

  public readonly countryCode: CountryCode;

  public constructor(phoneNumber: { number: string; countryCode: CountryCode }) {
    this.number = phoneNumber.number;
    this.countryCode = phoneNumber.countryCode;
  }

  public static create({ number, countryCode }: PhoneNumberData): PhoneNumber {
    if (!isValidPhoneNumber(number, countryCode as CountryCodeType)) {
      throw InvalidParameterError.withParameter('number', number);
    }

    const phoneNumber = parsePhoneNumber(number, countryCode as CountryCodeType);
    return new PhoneNumber({
      number: phoneNumber.nationalNumber.toString(),
      countryCode: phoneNumber.country as CountryCode,
    });
  }

  formatInternational() {
    return parsePhoneNumber(this.number, this.countryCode as CountryCodeType).formatInternational();
  }

  toJSON() {
    return {
      number: this.number,
      countryCode: this.countryCode,
    };
  }
}
