/* eslint-disable no-plusplus */
import { faker } from '@faker-js/faker';
import _ from 'lodash';

import { CompanyModel } from '@app/contexts';
import { testingDefaults } from '@libs/testing';

export class CompanyFixtureFactory {
  private static counter = 0;

  public static create(overrides?: Partial<CompanyModel>): CompanyModel {
    const companyDao = new CompanyModel();

    companyDao.name = 'InPost';

    const defaults = {
      id: overrides?.id,
      name: testingDefaults.company.name,
      contactEmail: testingDefaults.company.contactEmail,
      contactPhone: testingDefaults.company.contactPhone,
      address: testingDefaults.company.address,
    };

    return _.merge(companyDao, defaults, overrides);
  }

  public static createRandom(overrides?: Partial<CompanyModel>): CompanyModel {
    const companyDao = new CompanyModel();

    // Generate a unique department name using the counter
    const companyName = `${faker.company.name()}_${this.counter++}`;
    const companyContactEmail = faker.internet.email({
      firstName: `${faker.name.firstName()}_${this.counter}`,
    });
    const companyAddress = {
      street: faker.address.street(),
      streetNumber: faker.helpers.rangeToNumber({
        min: 1,
        max: 250,
      }),
      city: faker.address.city(),
      countryCode: faker.address.countryCode({ variant: 'alpha-2' }),
      postalCode: faker.address.zipCode(),
    };
    const companyContactPhone = {
      countryCode: faker.address.countryCode({ variant: 'alpha-2' }),
      number: faker.phone.number(),
    };
    const companyId = faker.string.uuid();

    const defaults = {
      id: companyId,
      name: companyName,
      contactEmail: companyContactEmail,
      contactPhone: companyContactPhone,
      address: companyAddress,
    };
    return _.merge(companyDao, defaults, overrides);
  }
}
