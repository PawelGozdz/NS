export abstract class ICategoryModel {
  id: number;

  name: string;

  description: string | null;

  parentId: number | null;

  updatedAt: Date;

  createdAt: Date;
}
