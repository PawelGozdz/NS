import { TableNames } from '@app/core';
import { ICategoryModel } from '@libs/common';
import { BaseModel } from '@libs/ddd';

export class CategoryModel extends BaseModel implements ICategoryModel {
  id: number;

  name: string;

  description: string | null;

  ctx: string;

  parentId: number | null;

  updatedAt: Date;

  createdAt: Date;

  static tableName = TableNames.CATEGORIES;
}
