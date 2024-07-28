/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Skill } from './skill.entity';

type Input = {
  id?: number;
  name?: string;
  description?: string;
  categoryId?: number;
};

export class SkillEntityFixtureFactory {
  public static create(overrides?: Input): Skill {
    const id = overrides?.id ?? 1;
    const name = overrides?.name ? overrides.name : 'Grocery';
    const description = overrides?.description ? overrides.description : 'Grocery Skill';
    const categoryId = overrides?.categoryId ? overrides.categoryId : 3;

    return new Skill({
      id,
      name,
      description,
      categoryId,
    });
  }
}
