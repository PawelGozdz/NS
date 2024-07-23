export abstract class ISkillModel {
  id: number;

  name: string;

  description: string | null;

  context: string;

  parentId: number | null;

  categoryId: number;

  updatedAt: Date;

  createdAt: Date;
}
