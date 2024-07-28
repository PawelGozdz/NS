import { MissingValueError } from '@libs/common';

import { IncorrectSalaryError } from '../errors';

export interface ISalaryRange {
  from: number;
  to: number;
}

export class SalaryRange {
  readonly from: number;

  readonly to: number;

  constructor(from: number, to: number) {
    this.from = from;
    this.to = to;
  }

  public static create(from: number, to: number): SalaryRange {
    if (typeof from !== 'number') {
      throw MissingValueError.withValue(`SalaryRange.from: ${from}`);
    }

    if (typeof to !== 'number') {
      throw MissingValueError.withValue(`SalaryRange.to: ${to}`);
    }

    if (to < from) {
      throw IncorrectSalaryError.withValue(from, to);
    }

    return new SalaryRange(from, to);
  }
}
