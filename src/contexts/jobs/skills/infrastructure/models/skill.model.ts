import { ISkillModel, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class SkillModel extends BaseModel implements ISkillModel {
  id: number;

  name: string;

  description: string | null;

  context: string;

  parentId: number | null;

  categoryId: number;

  updatedAt: Date;

  createdAt: Date;

  static tableName = TableNames.SKILLS;
}
