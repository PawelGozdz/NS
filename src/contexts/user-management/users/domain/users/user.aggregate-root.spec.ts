import { Actor } from '@app/core';
import { ActorType, EntityId } from '@libs/common';

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

  const actor = Actor.create(ActorType.USER, User.name, '34d90467-aeb4-4016-9791-86f9aec010e0');

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
          actor,
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
      user.update({ email: newEmail, actor });

      // assert
      const events = user.getUncommittedEvents();

      expect(events[0]).toBeInstanceOf(UserUpdatedEvent);
      expect(user.getEmail()).toEqual(newEmail);
    });
  });
});
