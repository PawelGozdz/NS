/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingValueError } from '@libs/common';

import { IncorrectSalaryError } from '../errors';
import { SalaryRange } from './salary-range.value-object';

describe('SalaryRange', () => {
  it('should create a valid SalaryRange object when min is less than max', () => {
    const min = 50000;
    const max = 100000;
    const salaryRange = SalaryRange.create(min, max);
    expect(salaryRange).toBeInstanceOf(SalaryRange);
  });

  it('should throw MissingValueError if min is not a number', () => {
    const min: any = 'not-a-number';
    const max = 100000;
    expect(() => SalaryRange.create(min, max)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if max is not a number', () => {
    const min = 50000;
    const max: any = 'not-a-number';
    expect(() => SalaryRange.create(min, max)).toThrow(MissingValueError);
  });

  it('should throw IncorrectSalaryError if max is not greater than min', () => {
    const min = 100000;
    const max = 50000;
    expect(() => SalaryRange.create(min, max)).toThrow(IncorrectSalaryError);
  });
});
