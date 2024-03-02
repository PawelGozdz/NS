import _ from 'lodash';

import { CategoryModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class CategoryFixtureFactory {
  public static create(overrides?: Partial<CategoryModel>): CategoryModel {
    const categoryDao = new CategoryModel();

    categoryDao.description = 'Category description';

    const defaults = {
      name: testingDefaults.category.name,
      description: testingDefaults.category.description,
      ctx: testingDefaults.category.ctx,
    };

    return _.merge(categoryDao, defaults, overrides);
  }
}
