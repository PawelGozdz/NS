export class Skill {
  id: number;

  name: string;

  description?: string | null;

  categoryId: number;

  constructor(props: Skill) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.categoryId = props.categoryId;
  }

  public static create({ id, name, description, categoryId }: { id: number; name: string; description?: string | null; categoryId: number }): Skill {
    const skill = new Skill({
      id,
      name,
      description: description ?? null,
      categoryId,
    });

    return skill;
  }
}

export type ISkillCreateData = {
  name: string;
  description?: string | null;
  categoryId: number;
};

export type ISkillUpdateData = {
  id: number;
  name?: string;
  description?: string | null;
  categoryId?: number;
};
