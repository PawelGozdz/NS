import { dayjs, MissingValueError } from '@libs/common';

import { ExperienceError } from '../errors';
import { Experience } from './experience.value-object';

describe('Experience', () => {
  it('should create a valid Experience object with all fields provided', () => {
    const role = 'Software Engineer';
    const company = 'Tech Company';
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2022-01-01');
    const experience = Experience.create(role, company, startDate, endDate);

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should throw MissingValueError if role is empty', () => {
    const role = '';
    const company = 'Tech Company';
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2022-01-01');

    expect(() => Experience.create(role, company, startDate, endDate)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if company is empty', () => {
    const role = 'Software Engineer';
    const company = '';
    const startDate = new Date('2020-01-01');
    const endDate = new Date('2022-01-01');

    expect(() => Experience.create(role, company, startDate, endDate)).toThrow(MissingValueError);
  });

  it('should create a valid Experience object with all fields provided', () => {
    const role = 'Software Engineer';
    const company = 'Tech Company';
    const startDate = dayjs('2020-01-01').toDate();
    const endDate = dayjs('2022-01-01').toDate();
    const experience = Experience.create(role, company, startDate, endDate);

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should allow endDate to be null', () => {
    const role = 'Software Engineer';
    const company = 'Tech Company';
    const startDate = dayjs('2020-01-01').toDate();
    const endDate = null;
    const experience = Experience.create(role, company, startDate, endDate);

    expect(experience).toBeInstanceOf(Experience);
  });

  it('should throw MissingValueError if role is empty', () => {
    const role = '';
    const company = 'Tech Company';
    const startDate = dayjs('2020-01-01').toDate();
    const endDate = dayjs('2022-01-01').toDate();

    expect(() => Experience.create(role, company, startDate, endDate)).toThrow(MissingValueError);
  });

  it('should throw MissingValueError if company is empty', () => {
    const role = 'Software Engineer';
    const company = '';
    const startDate = dayjs('2020-01-01').toDate();
    const endDate = dayjs('2022-01-01').toDate();

    expect(() => Experience.create(role, company, startDate, endDate)).toThrow(MissingValueError);
  });

  it('should throw ExperienceError if endDate is earlier than startDate', () => {
    const role = 'Software Engineer';
    const company = 'Tech Company';
    const startDate = dayjs('2022-01-01').toDate();
    const endDate = dayjs('2020-01-01').toDate();

    expect(() => Experience.create(role, company, startDate, endDate)).toThrow(ExperienceError);
  });
});
