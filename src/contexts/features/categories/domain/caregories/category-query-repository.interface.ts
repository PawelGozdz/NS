import { ICategoriesQueryParams } from '@app/core';

export type CategoryInfo = {
  id: number;
  name: string;
  context: string;
  parentId: number | null;
  description: string | null;
};

export abstract class ICategoriesQueryRepository {
  abstract getManyBy(query: ICategoriesQueryParams): Promise<CategoryInfo[]>;
}
