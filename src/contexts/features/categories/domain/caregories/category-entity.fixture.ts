/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Category } from './category.entity';

type Input = {
  id?: number;
  name?: string;
  description?: string;
  ctx?: string;
  parentId?: number;
};

export class CategoryEntityFixtureFactory {
  public static create(overrides?: Input): Category {
    const id = overrides?.id ?? 1;
    const name = overrides?.name ? overrides.name : 'Grocery';
    const description = overrides?.description ? overrides.description : 'Grocery category';
    const ctx = overrides?.ctx ? overrides.ctx : 'test-context';
    const parentId = overrides?.parentId ? overrides.parentId : null;

    return new Category({
      id,
      name,
      description,
      ctx,
      parentId,
    });
  }
}
