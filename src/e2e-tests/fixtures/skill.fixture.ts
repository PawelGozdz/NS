import _ from 'lodash';

import { SkillModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class SkillFixtureFactory {
  public static create(overrides?: Partial<SkillModel>): SkillModel {
    const skillDao = new SkillModel();

    skillDao.description = 'Skill description';

    const defaults = {
      name: testingDefaults.skill.name,
      description: testingDefaults.skill.description,
      context: testingDefaults.skill.context,
    };

    return _.merge(skillDao, defaults, overrides);
  }
}
