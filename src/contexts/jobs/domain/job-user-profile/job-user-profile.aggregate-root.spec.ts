import { Actor, SalaryRange } from '@app/core';
import { ActorType, EntityId } from '@libs/common';

import { JobUserProfileCreatedEvent, JobUserProfileUpdatedEvent } from './events';
import { JobUserProfile } from './job-user-profile.aggregate-root';
import { JobUserProfileAggregateRootFixtureFactory } from './job-user-profile.aggregate-root.fixture';

describe('JobUserProfile', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  const actor = Actor.create(ActorType.USER, 'handlerName', EntityId.createRandom().value);

  describe('create', () => {
    describe('Success', () => {
      it('should apply JobUserProfileCreatedEvent with property values', () => {
        // arrange

        // act
        const entity = JobUserProfile.create({
          userId: EntityId.createRandom(),
          bio: 'test',
          certificates: [],
          actor,
          jobPositionIds: [],
          jobIds: [],
          salaryRange: SalaryRange.create(1000, 2000),
        });

        // assert
        const events = entity.getUncommittedEvents();

        expect(events.length).toEqual(1);
        expect(events[0]).toBeInstanceOf(JobUserProfileCreatedEvent);
      });
    });
  });

  describe('update', () => {
    it('should apply JobUserProfileUpdatedEvent with properties to be updated', () => {
      // arrange
      const user = JobUserProfileAggregateRootFixtureFactory.create();

      const bio = 'my-new-bio';

      // act
      user.update({ bio, actor });

      // assert
      const events = user.getUncommittedEvents() as JobUserProfileUpdatedEvent[];

      expect(events[0]).toBeInstanceOf(JobUserProfileUpdatedEvent);
      expect(events[0]?.bio).toEqual(bio);
      expect(user.getBio()).toEqual(bio);
    });
  });
});
