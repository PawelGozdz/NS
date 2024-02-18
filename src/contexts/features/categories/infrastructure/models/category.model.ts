import { TableNames } from '@app/database';
import { AppContext, ICategoryModel } from '@libs/common';
import { BaseModel } from '@libs/ddd';

export class CategoryModel extends BaseModel implements ICategoryModel {
	id: number;

	name: string;

	description: string | null;

	context: AppContext;

	parentId: number | null;

	updatedAt: Date;

	createdAt: Date;

	version: number;

	static tableName = TableNames.CATEGORIES;
}
