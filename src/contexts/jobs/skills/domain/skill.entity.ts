export class Skill {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  context: string;

  categoryId: number;

  constructor(props: Skill) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.parentId = props.parentId ?? null;
    this.context = props.context;
    this.categoryId = props.categoryId;
  }

  public static create({
    id,
    name,
    description,
    parentId,
    context,
    categoryId,
  }: {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
    context: string;
    categoryId: number;
  }): Skill {
    const skill = new Skill({
      id,
      name,
      description: description ?? null,
      parentId: parentId ?? null,
      context,
      categoryId,
    });

    return skill;
  }
}

export type ISkillCreateData = {
  name: string;
  description?: string | null;
  parentId?: number | null;
  context: string;
  categoryId: number;
};

export type ISkillUpdateData = {
  id: number;
  name?: string;
  description?: string | null;
  context?: string;
  parentId?: number | null;
  categoryId?: number;
};
