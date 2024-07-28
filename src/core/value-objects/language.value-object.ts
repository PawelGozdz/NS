import { MissingValueError } from '@libs/common';

import { Lang } from '../enums';

export interface ILanguage {
  name: Lang;
}

export class Language {
  private readonly name: Lang;

  private constructor(name: Lang) {
    this.name = name;
  }

  public static create(name: Lang): Language {
    if (!Object.values(Lang).includes(name)) {
      throw new MissingValueError(`Invalid language name: ${name}`);
    }

    return new Language(name);
  }
}
