import { Category } from './category.aggregate-root';

export abstract class ICategoriesCommandRepository {
	abstract save(category: Category): Promise<void>;
	abstract getOneById(id: number): Promise<Category | undefined>;
	abstract getOneByNameAndContext(name: string, context: string): Promise<Category | undefined>;
}
