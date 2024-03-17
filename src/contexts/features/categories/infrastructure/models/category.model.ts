import { ICategoryModel, TableNames } from '@app/core';
import { BaseModel } from '@libs/ddd';

export class CategoryModel extends BaseModel implements ICategoryModel {
  id: number;

  name: string;

  description: string | null;

  context: string;

  parentId: number | null;

  updatedAt: Date;

  createdAt: Date;

  static tableName = TableNames.CATEGORIES;
}
