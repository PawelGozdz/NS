export abstract class ISkillModel {
  id: number;

  name: string;

  description: string | null;

  categoryId: number;

  updatedAt: Date;

  createdAt: Date;
}
