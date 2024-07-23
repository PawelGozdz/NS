import { ISkillCreateData, Skill } from './skill.entity';

export abstract class ISkillsCommandRepository {
  abstract save(skill: ISkillCreateData): Promise<{ id: number }>;

  abstract getOneById(id: number): Promise<Skill | undefined>;

  abstract getOneByNameAndContext(name: string, context: string): Promise<Skill | undefined>;
}
