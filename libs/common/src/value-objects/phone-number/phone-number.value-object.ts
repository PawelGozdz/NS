import { CountryCode, InvalidParameterError } from '@libs/common';
import { CountryCode as CountryCodeType, isValidPhoneNumber, parsePhoneNumber } from 'libphonenumber-js';

export type PhoneNumberData = {
	number: string;
	countryCode: CountryCode;
};

export class PhoneNumber {
	public constructor(
		readonly number: string,
		readonly countryCode: CountryCode,
	) {}

	public static create({ number, countryCode }: PhoneNumberData): PhoneNumber {
		if (!isValidPhoneNumber(number, { defaultCallingCode: countryCode })) {
			throw InvalidParameterError.withParameter('number', number);
		}

		const phoneNumber = parsePhoneNumber(number, countryCode as CountryCodeType);
		return new PhoneNumber(phoneNumber.nationalNumber.toString(), countryCode);
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
