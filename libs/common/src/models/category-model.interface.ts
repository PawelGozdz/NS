export abstract class ICategoryModel {
	id: number;

	name: string;

	description: string | null;

	ctx: string;

	parentId: number | null;

	updatedAt: Date;

	createdAt: Date;
}
