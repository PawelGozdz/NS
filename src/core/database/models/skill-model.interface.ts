export abstract class ISkillModel {
  id: number;

  name: string;

  description: string | null;

  context: string;

  parentId: number | null;

  updatedAt: Date;

  createdAt: Date;
}
