/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { CategoryModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class CategoryFixtureFactory {
  private static counter = 0;

  public static create(overrides?: Partial<CategoryModel>): CategoryModel {
    const categoryDao = new CategoryModel();

    categoryDao.description = 'Category description';

    const defaults = {
      id: overrides?.id,
      name: testingDefaults.category.name,
      description: testingDefaults.category.description,
    };

    return _.merge(categoryDao, defaults, overrides);
  }

  public static createRandom(overrides?: Partial<CategoryModel>): CategoryModel {
    const categoryDao = new CategoryModel();

    categoryDao.description = faker.lorem.sentence();

    // Generate a unique department name using the counter
    const departmentName = `${faker.commerce.department()}_${this.counter++}`;

    const defaults = {
      name: departmentName,
      description: faker.lorem.sentence(),
    };
    return _.merge(categoryDao, defaults, overrides);
  }
}
