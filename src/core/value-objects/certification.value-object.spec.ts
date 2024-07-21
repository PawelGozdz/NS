import { MissingValueError } from '@libs/common';

import { CertificationError } from '../errors/certification.error';
import { Certification } from './certification.value-object';

describe('Certification', () => {
  const currentYear = new Date().getFullYear();

  it('should create a valid Certification object', () => {
    const certification = Certification.create('Certified Tester', 'Testing Institute', currentYear);
    expect(certification).toBeDefined();
    expect(certification).toBeInstanceOf(Certification);
  });

  it('should throw MissingValueError if name is empty', () => {
    expect(() => Certification.create('', 'Testing Institute', currentYear)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if institution is empty', () => {
    expect(() => Certification.create('Certified Tester', '', currentYear)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if year is not provided', () => {
    const year = null as unknown as number;
    expect(() => Certification.create('Certified Tester', 'Testing Institute', year)).toThrow(MissingValueError);
  });

  it('should throw CertificationError if year is not a number', () => {
    const year = 'not-a-number' as unknown as number;
    expect(() => Certification.create('Certified Tester', 'Testing Institute', year)).toThrow(CertificationError);
  });

  it('should throw CertificationError if year is in the future', () => {
    const futureYear = currentYear + 1;
    expect(() => Certification.create('Certified Tester', 'Testing Institute', futureYear)).toThrow(CertificationError);
  });
});
