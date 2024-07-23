import _ from 'lodash';

import { CategoryModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class CategoryFixtureFactory {
  public static create(overrides?: Partial<CategoryModel>): CategoryModel {
    const categoryDao = new CategoryModel();

    categoryDao.description = 'Category description';

    const defaults = {
      id: overrides?.id,
      name: testingDefaults.category.name,
      description: testingDefaults.category.description,
      context: testingDefaults.category.context,
    };

    return _.merge(categoryDao, defaults, overrides);
  }
}
