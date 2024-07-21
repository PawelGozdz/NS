import { MissingValueError } from '@libs/common';

import { Lang } from '../enums';
import { Language } from './language.value-object';

describe('Language Value Object', () => {
  it('should create a valid Language object for each enum value', () => {
    Object.values(Lang).forEach((lang) => {
      expect(() => Language.create(lang)).not.toThrow();
      const language = Language.create(lang);
      expect(language).toBeInstanceOf(Language);
    });
  });

  it('should throw MissingValueError for an invalid language name', () => {
    const invalidLang = 'InvalidLang'; // Assuming this value is not in the Lang enum
    expect(() => Language.create(invalidLang as Lang)).toThrow(MissingValueError);
  });
});
