import { dayjs, MissingValueError } from '@libs/common'; // Adjust import path as necessary

import { CertificationError } from '../errors';

export class Certification {
  private readonly name: string;

  private readonly institution: string;

  private readonly year: number;

  private constructor(name: string, institution: string, year: number) {
    this.name = name;
    this.institution = institution;
    this.year = year;
  }

  public static create(name: string, institution: string, year: number): Certification {
    if (!name) {
      throw new MissingValueError('Certification.name');
    }

    if (!institution) {
      throw new MissingValueError('Certification.institution');
    }

    if (!year) {
      throw new MissingValueError('Certification.year');
    }

    if (typeof year !== 'number') {
      throw new CertificationError(`Invalid year: ${year}`);
    }

    if (dayjs(year).isAfter(dayjs().year())) {
      throw new CertificationError(`Certification year cannot be in the future: ${year}`);
    }

    return new Certification(name, institution, year);
  }
}
