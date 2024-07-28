import { dayjs, MissingValueError } from '@libs/common'; // Adjust import path as necessary

import { CertificationError } from '../errors';

export interface ICertification {
  name: string;
  institution: string;
  completionYear: number;
}

export class Certification {
  readonly name: string;

  readonly institution: string;

  readonly completionYear: number;

  constructor(name: string, institution: string, completionYear: number) {
    this.name = name;
    this.institution = institution;
    this.completionYear = completionYear;
  }

  public static create(name: string, institution: string, completionYear: number): Certification {
    if (!name) {
      throw new MissingValueError('Certification.name');
    }

    if (!institution) {
      throw new MissingValueError('Certification.institution');
    }

    if (!completionYear) {
      throw new MissingValueError('Certification.completionYear');
    }

    if (typeof completionYear !== 'number') {
      throw new CertificationError(`Invalid completionYear: ${completionYear}`);
    }

    if (dayjs(completionYear).isAfter(dayjs().year())) {
      throw new CertificationError(`Certification completionYear cannot be in the future: ${completionYear}`);
    }

    return new Certification(name, institution, completionYear);
  }
}
