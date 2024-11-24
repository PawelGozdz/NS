/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { SkillModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class SkillFixtureFactory {
  private static counter = 0;

  public static create(overrides?: Partial<SkillModel>): SkillModel {
    const skillDao = new SkillModel();

    skillDao.description = 'Skill description';

    const defaults = {
      name: testingDefaults.skill.name,
      description: testingDefaults.skill.description,
    };

    return _.merge(skillDao, defaults, overrides);
  }

  public static createRandom(overrides?: Partial<SkillModel>): SkillModel {
    const skillDao = new SkillModel();
    skillDao.description = faker.lorem.sentence();

    // Generate a unique skill name using the counter
    const skillName = `${faker.hacker.noun()}_${this.counter++}`;

    const defaults = {
      name: skillName,
      description: faker.lorem.sentence(),
    };
    return _.merge(skillDao, defaults, overrides);
  }
}
