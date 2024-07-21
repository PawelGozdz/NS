import { MissingValueError } from '@libs/common';

import { EducationError } from '../errors';
import { Education } from './education.value-object';

describe('Education', () => {
  describe('create', () => {
    it('should successfully create an Education instance with valid inputs', () => {
      const education = Education.create('BSc Computer Science', 'University of Example', 2022);
      expect(education).toBeInstanceOf(Education);
    });

    it('should throw MissingValueError if degree is missing', () => {
      expect(() => Education.create('', 'University of Example', 2022)).toThrow(MissingValueError);
    });

    it('should throw MissingValueError if institution is missing', () => {
      expect(() => Education.create('BSc Computer Science', '', 2022)).toThrow(MissingValueError);
    });

    it('should throw MissingValueError if graduateYear is missing', () => {
      const graduateYear = null as unknown as number;
      expect(() => Education.create('BSc Computer Science', 'University of Example', graduateYear)).toThrow(MissingValueError);
    });

    it('should throw EducationError if graduateYear is not a number', () => {
      const graduateYear = '2022' as unknown as number;
      expect(() => Education.create('BSc Computer Science', 'University of Example', graduateYear)).toThrow(EducationError);
    });
  });
});
