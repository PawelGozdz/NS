import { MissingValueError, dayjs } from '@libs/common';

import { ExperienceError } from '../errors';

export class Experience {
  private readonly role: string;

  private readonly company: string;

  private readonly startDate: Date;

  private readonly endDate: Date | null;

  private constructor(role: string, company: string, startDate: Date, endDate: Date | null) {
    this.role = role;
    this.company = company;
    this.startDate = startDate;
    this.endDate = endDate;
  }

  public static create(role: string, company: string, startDate: Date, endDate: Date | null): Experience {
    if (!role) {
      throw new MissingValueError('Experience.role');
    }

    if (!company) {
      throw new MissingValueError('Experience.company');
    }

    if (!startDate || typeof startDate !== 'object') {
      throw new MissingValueError('Experience.startDate');
    }

    if (typeof endDate !== 'object') {
      throw new MissingValueError('Experience.endDate');
    }

    if (endDate && dayjs(endDate).isBefore(dayjs(startDate))) {
      throw ExperienceError.withMessage(`End date (${endDate}) cannot be before start date ${startDate}`);
    }

    return new Experience(role, company, startDate, endDate);
  }
}
