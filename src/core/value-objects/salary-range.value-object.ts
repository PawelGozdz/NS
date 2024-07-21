import { MissingValueError } from '@libs/common';

import { IncorrectSalaryError } from '../errors';

export class SalaryRange {
  private readonly min: number;

  private readonly max: number;

  private constructor(min: number, max: number) {
    this.min = min;
    this.max = max;
  }

  public static create(min: number, max: number): SalaryRange {
    if (typeof min !== 'number') {
      throw MissingValueError.withValue(`SalaryRange.min: ${min}`);
    }

    if (typeof max !== 'number') {
      throw MissingValueError.withValue(`SalaryRange.max: ${max}`);
    }

    if (max < min) {
      throw IncorrectSalaryError.withValue(min, max);
    }

    return new SalaryRange(min, max);
  }
}
