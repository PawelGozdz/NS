import { MissingValueError } from '@libs/common';

import { ExperienceError } from '../errors/experience.error';
import { Experience } from './experience.value-object';

const skillId = 44;

describe('Experience', () => {
  describe('create', () => {
    it('should create an Experience object with valid parameters', () => {
      const startDate = new Date('2020-01-01');
      const endDate = new Date('2021-01-01');
      const experience = Experience.create(skillId, startDate, endDate, null);

      expect(experience).toBeInstanceOf(Experience);
      expect(experience.skillId).toBe(skillId);
      expect(experience.startDate).toBe(startDate);
      expect(experience.endDate).toBe(endDate);
      expect(experience.experienceInMonths).toBe(12);
    });

    it('should throw MissingValueError if id is missing', () => {
      expect(() => {
        Experience.create('' as unknown as number, new Date('2020-01-01'), new Date('2021-01-01'), null);
      }).toThrow(MissingValueError);
    });

    it('should throw ExperienceError if id is not a valid number', () => {
      expect(() => {
        Experience.create('invalid-number' as unknown as number, new Date('2020-01-01'), new Date('2021-01-01'), null);
      }).toThrow(ExperienceError);
    });

    it('should throw ExperienceError if endDate is before startDate', () => {
      expect(() => {
        Experience.create(skillId, new Date('2021-01-01'), new Date('2020-01-01'), null);
      }).toThrow(ExperienceError);
    });

    it('should throw MissingValueError if startDate is invalid and endDate and experienceInMonths are empty', () => {
      expect(() => {
        Experience.create(skillId, null, null, null);
      }).toThrow(MissingValueError);
    });

    it('should use experienceInMonths if provided and valid', () => {
      const experienceInMonths = 24;
      const experience = Experience.create(skillId, null, null, experienceInMonths);

      expect(experience).toBeInstanceOf(Experience);
      expect(experience.skillId).toBe(skillId);
      expect(experience.startDate).toBeNull();
      expect(experience.endDate).toBeNull();
      expect(experience.experienceInMonths).toBe(experienceInMonths);
    });

    it('should create an Experience object with only a start date', () => {
      const startDate = new Date('2020-01-01');
      const experience = Experience.create(skillId, startDate, null, null);

      expect(experience).toBeInstanceOf(Experience);
      expect(experience.skillId).toBe(skillId);
      expect(experience.startDate).toBe(startDate);
      expect(experience.endDate).toBeNull();
      expect(experience.experienceInMonths).toBe(0); // Default value
    });

    it('should throw MissingValueError if only endDate is provided', () => {
      expect(() => {
        Experience.create(skillId, null, new Date('2021-01-01'), null);
      }).toThrow(MissingValueError);
    });

    it('should throw ExperienceError if startDate or endDate is in an invalid format', () => {
      expect(() => {
        Experience.create(skillId, new Date('invalid-date'), new Date('2021-01-01'), null);
      }).toThrow(ExperienceError);

      expect(() => {
        Experience.create(skillId, new Date('2020-01-01'), new Date('invalid-date'), null);
      }).toThrow(ExperienceError);
    });

    it('should throw ExperienceError if experienceInMonths is negative', () => {
      expect(() => {
        Experience.create(skillId, null, null, -5);
      }).toThrow(ExperienceError);
    });
  });
});
