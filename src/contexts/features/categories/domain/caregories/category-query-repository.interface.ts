export type CategoryInfo = {
	id: number;
	name: string;
	description?: string;
	parentId?: number;
	context: string;
};

export abstract class ICategoriesQueryRepository {
	abstract getOneById(id: number): Promise<CategoryInfo | undefined>;
}
