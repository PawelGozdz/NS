import { AppContext } from '@libs/common';

export abstract class ICategoryModel {
	id: number;

	name: string;

	description: string | null;

	context: AppContext;

	parentId: number | null;

	updatedAt: Date;

	createdAt: Date;
}
