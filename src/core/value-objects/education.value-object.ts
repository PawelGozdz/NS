import { MissingValueError } from '@libs/common';

import { EducationError } from '../errors';

export class Education {
  private readonly degree: string;

  private readonly institution: string;

  private readonly graduateYear: number;

  private constructor(degree: string, institution: string, graduateYear: number) {
    this.degree = degree;
    this.institution = institution;
    this.graduateYear = graduateYear;
  }

  public static create(degree: string, institution: string, graduateYear: number): Education {
    if (!degree) {
      throw new MissingValueError('Education.degree');
    }

    if (!institution) {
      throw new MissingValueError('Education.institution');
    }

    if (!graduateYear) {
      throw new MissingValueError('Education.graduateYear');
    }

    if (typeof graduateYear !== 'number') {
      throw new EducationError(`Incorrect graduate year: ${graduateYear}`);
    }

    return new Education(degree, institution, graduateYear);
  }
}
