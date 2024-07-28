export class Category {
  id: number;

  name: string;

  description?: string | null;

  parentId?: number | null;

  constructor(props: Category) {
    this.id = props.id;
    this.name = props.name;
    this.description = props.description ?? null;
    this.parentId = props.parentId ?? null;
  }

  public static create({
    id,
    name,
    description,
    parentId,
  }: {
    id: number;
    name: string;
    description?: string | null;
    parentId?: number | null;
  }): Category {
    const category = new Category({
      id,
      name,
      description: description ?? null,
      parentId: parentId ?? null,
    });

    return category;
  }
}

export type ICategoryCreateData = {
  name: string;
  description?: string | null;
  parentId?: number | null;
};

export type ICategoryUpdateData = {
  id: number;
  name?: string;
  description?: string | null;
  parentId?: number | null;
};
