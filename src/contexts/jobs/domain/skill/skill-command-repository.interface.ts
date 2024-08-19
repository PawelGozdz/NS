import { ISkillCreateData, Skill } from './skill.entity';

export abstract class ISkillsCommandRepository {
  abstract save(skill: ISkillCreateData): Promise<{ id: number }>;

  abstract getOneById(id: number): Promise<Skill | undefined>;

  abstract getOneByNameAndCategoryId(name: string, categoryId: number): Promise<Skill | undefined>;
}
