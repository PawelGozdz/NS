/* eslint-disable @typescript-eslint/no-explicit-any */
import { MissingValueError } from '@libs/common';

import { IncorrectSalaryError } from '../errors';
import { SalaryRange } from './salary-range.value-object';

describe('SalaryRange', () => {
  it('should create a valid SalaryRange object when from is less than to', () => {
    const from = 50000;
    const to = 100000;
    const salaryRange = SalaryRange.create(from, to);
    expect(salaryRange).toBeInstanceOf(SalaryRange);
  });

  it('should throw MissingValueError if from is not a number', () => {
    const from: any = 'not-a-number';
    const to = 100000;
    expect(() => SalaryRange.create(from, to)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if to is not a number', () => {
    const from = 50000;
    const to: any = 'not-a-number';
    expect(() => SalaryRange.create(from, to)).toThrow(MissingValueError);
  });

  it('should throw IncorrectSalaryError if to is not greater than from', () => {
    const from = 100000;
    const to = 50000;
    expect(() => SalaryRange.create(from, to)).toThrow(IncorrectSalaryError);
  });
});
