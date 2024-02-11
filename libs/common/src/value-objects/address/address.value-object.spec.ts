import { CountryCode, MissingValueError } from '@libs/common';
import { Address } from './address.value-object';

describe('Address.create', () => {
	it('should throw MissingValueError when street is missing', () => {
		expect(() => Address.create({ streetNumber: '12', city: 'city', countryCode: CountryCode.Poland, postalCode: 'postal code' })).toThrow(
			new MissingValueError('Address.street'),
		);
	});

	it('should throw MissingValueError when streetNumber is missing and street does not contain numbers', () => {
		expect(() => Address.create({ street: 'street', city: 'city', countryCode: CountryCode.Poland, postalCode: 'postal code' })).toThrow(
			new MissingValueError('Address.streetNumber must be present if Address.street doesnt contain numbers'),
		);
	});

	it('should throw MissingValueError when city is missing', () => {
		expect(() => Address.create({ street: 'street', streetNumber: '12', countryCode: CountryCode.Poland, postalCode: 'postal code' })).toThrow(
			new MissingValueError('Address.city'),
		);
	});

	it('should throw MissingValueError when countryCode is missing', () => {
		expect(() => Address.create({ street: 'street', streetNumber: '12', city: 'city', postalCode: 'postal code' })).toThrow(
			new MissingValueError('Address.countryCode'),
		);
	});

	it('should throw MissingValueError when postalCode is missing', () => {
		expect(() => Address.create({ street: 'street', streetNumber: '12', city: 'city', countryCode: CountryCode.Poland })).toThrow(
			new MissingValueError('Address.postalCode'),
		);
	});

	it('should create an Address when all required fields are present', () => {
		const address = Address.create({
			street: 'street',
			streetNumber: '12',
			city: 'city',
			countryCode: CountryCode.Poland,
			postalCode: 'postal code',
		});
		expect(address).toEqual(new Address('street', '12', 'city', CountryCode.Poland, 'postal code'));
	});
});
