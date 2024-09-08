import { isNumber } from 'class-validator';

import { AppUtils, MissingValueError, dayjs } from '@libs/common';

import { ExperienceError } from '../errors';

export interface IExperience {
  skillId: number;
  startDate: Date | null;
  endDate: Date | null;
  experienceInMonths: number;
}

export class Experience {
  readonly skillId: number;

  readonly startDate: Date | null;

  readonly endDate: Date | null;

  readonly experienceInMonths: number;

  constructor(skillId: number, startDate: Date | null, endDate: Date | null, experienceInMonths: number) {
    this.skillId = skillId;
    this.startDate = startDate;
    this.endDate = endDate;
    this.experienceInMonths = experienceInMonths;
  }

  public static create(skillId: number, startDate: Date | null, endDate: Date | null, experienceInMonths: number | null): Experience {
    let expInMonths = 0;

    if (!skillId) {
      throw new MissingValueError('Experience.skillId');
    }

    if (!isNumber(skillId)) {
      throw new ExperienceError(`Invalid number: ${skillId}`);
    }

    if (startDate && !dayjs(startDate).isValid()) {
      throw new ExperienceError(`Invalid start date: ${startDate}`);
    }

    if (endDate && !dayjs(endDate).isValid()) {
      throw new ExperienceError(`Invalid end date: ${endDate}`);
    }

    if (startDate && endDate) {
      if (dayjs(endDate).isBefore(dayjs(startDate))) {
        throw ExperienceError.withMessage(`End date (${endDate}) cannot be before start date (${startDate})`);
      }
      expInMonths = dayjs(endDate).diff(dayjs(startDate), 'month');
    } else if (!startDate && endDate) {
      throw new MissingValueError('Experience.startDate');
    } else if (!startDate && AppUtils.isEmpty(endDate) && AppUtils.isEmpty(experienceInMonths)) {
      throw new MissingValueError('Experience.experienceInMonths');
    } else if (!startDate && !endDate && experienceInMonths) {
      expInMonths = experienceInMonths;
    }

    if (expInMonths < 0) {
      throw new ExperienceError('Experience in months cannot be negative');
    }

    return new Experience(skillId, startDate, endDate, expInMonths);
  }
}
