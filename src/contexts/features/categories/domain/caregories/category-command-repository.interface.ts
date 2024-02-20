import { Category, ICategoryCreateData, ICategoryUpdateData } from './category.entity';

export abstract class ICategoriesCommandRepository {
	abstract save(category: ICategoryCreateData): Promise<{ id: number }>;
	abstract update(category: ICategoryUpdateData): Promise<void>;
	abstract getOneById(id: number): Promise<Category | undefined>;
	abstract getOneByNameAndContext(name: string, context: string): Promise<Category | undefined>;
}
