import { Address, CountryCode, EntityId } from '@libs/common';

import { User } from './user.aggregate-root';

export class UserAggregateRootFixtureFactory {
  public static defaultFromDate = new Date('2021-10-20T16:00:00.000Z');

  public static defaultToDate = new Date('2021-10-27T16:00:00.000Z');

  public static create(overrides?: { id?: string; email?: string }): User {
    const userId = overrides?.id ? new EntityId(overrides.id) : new EntityId('1283e394-a0c8-4fac-bfd8-87469267ba3c');
    const email = overrides?.email ? overrides.email : 'test55@test.com';

    return new User({
      id: userId,
      email,
      profile: {
        id: new EntityId('b83c6426-6863-4347-8356-d60e516fa3d3'),
        userId,
        firstName: 'John',
        lastName: 'Doe',
        username: 'johndoe',
        address: Address.create({
          street: 'Test',
          streetNumber: '123',
          city: 'Test',
          countryCode: CountryCode.Poland,
          postalCode: '12-345',
        }),
        bio: 'my-awesome-bio',
        gender: 'male',
        dateOfBirth: new Date('1990-01-01'),
        hobbies: ['test'],
        languages: ['en'],
        phoneNumber: '123456789',
        profilePicture: 'https://google.com/test.jpt',
        rodoAcceptanceDate: new Date('2021-01-01'),
      },
    });
  }
}
