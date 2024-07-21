export class Skill {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  context: string;

  constructor(props: Skill) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.parentId = props.parentId ?? null;
    this.context = props.context;
  }

  public static create({
    id,
    name,
    description,
    parentId,
    context,
  }: {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
    context: string;
  }): Skill {
    const skill = new Skill({
      id,
      name,
      description: description ?? null,
      parentId: parentId ?? null,
      context,
    });

    return skill;
  }
}

export type ISkillCreateData = {
  name: string;
  description?: string | null;
  parentId?: number | null;
  context: string;
};

export type ISkillUpdateData = {
  id: number;
  name?: string;
  description?: string | null;
  context?: string;
  parentId?: number | null;
};
