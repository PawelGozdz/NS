export class Category {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  context: string;

  constructor(props: Category) {
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
  }): Category {
    const category = new Category({
      id,
      name,
      description: description ?? null,
      parentId: parentId ?? null,
      context,
    });

    return category;
  }
}

export type ICategoryCreateData = {
  name: string;
  description?: string | null;
  parentId?: number | null;
  context: string;
};

export type ICategoryUpdateData = {
  id: number;
  name?: string;
  description?: string | null;
  context?: string;
  parentId?: number | null;
};
