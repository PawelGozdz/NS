import { CountryCode } from '../enums';
import { PhoneNumber } from './phone-number.value-object';

describe('PhoneNumber.toJSON', () => {
  it('should return an object with number and countryCode properties', () => {
    const phoneNumber = new PhoneNumber({
      number: '123456789',
      countryCode: CountryCode.Poland,
    });
    const json = phoneNumber.toJSON();
    expect(json).toEqual({
      number: '123456789',
      countryCode: CountryCode.Poland,
    });
  });

  it('should return an object with the same values as the PhoneNumber instance', () => {
    const number = '123456789';
    const countryCode = CountryCode.Poland;
    const phoneNumber = new PhoneNumber({
      number,
      countryCode,
    });
    const json = phoneNumber.toJSON();
    expect(json.number).toBe(number);
    expect(json.countryCode).toBe(countryCode);
  });
});
