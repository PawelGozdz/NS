import { EntityId } from '@libs/common';

import { Profile } from '../profiles';
import { UserCreatedEvent, UserUpdatedEvent } from './events';
import { User } from './user.aggregate-root';
import { UserAggregateRootFixtureFactory } from './user.aggregate-root.fixture';

const email = 'test@test.pl';

describe('User', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  describe('create', () => {
    describe('Success', () => {
      it('should apply UserCreatedEvent with property values', () => {
        // arrange

        // act
        const user = User.create({
          email,
          profile: {
            id: EntityId.createRandom(),
            userId: EntityId.createRandom(),
            firstName: 'test',
          },
        });

        // assert
        const events = user.getUncommittedEvents();

        expect(events.length).toEqual(1);
        expect(events[0]).toBeInstanceOf(UserCreatedEvent);

        expect(events[0]).toMatchSnapshot({
          id: expect.any(EntityId),
          profile: new Profile({
            firstName: 'test',
            id: expect.any(EntityId),
            userId: expect.any(EntityId),
          }),
        });
      });
    });
  });

  describe('update', () => {
    it('should apply UserUpdatedEvent with properties to be updated', () => {
      // arrange
      const user = UserAggregateRootFixtureFactory.create();

      const newEmail = 'new@test.pl';

      // act
      user.update({ email: newEmail });

      // assert
      const events = user.getUncommittedEvents();

      expect(events[0]).toBeInstanceOf(UserUpdatedEvent);
    });
  });
});
