import { Actor } from '@app/core';
import { ActorType, EntityId } from '@libs/common';

import { JobCreatedEvent, JobUpdatedEvent } from './events';
import { Job } from './job.aggregate-root';
import { JobAggregateRootFixtureFactory } from './job.aggregate-root.fixture';

describe('Job', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  const actor = Actor.create(ActorType.USER, 'handlerName', EntityId.createRandom().value);

  describe('create', () => {
    describe('Success', () => {
      it('should apply JobCreatedEvent with property values', () => {
        // arrange

        // act
        const entity = Job.create({
          title: 'Software Engineer',
          description: 'Job description',
          organizationId: EntityId.createRandom(),
          jobPositionId: EntityId.createRandom(),
          actor,
        });

        // assert
        const events = entity.getUncommittedEvents();

        expect(events.length).toEqual(1);
        expect(events[0]).toBeInstanceOf(JobCreatedEvent);
      });
    });
  });

  describe('update', () => {
    it('should apply JobUpdatedEvent with properties to be updated', () => {
      // arrange
      const job = JobAggregateRootFixtureFactory.create();

      const title = 'Senior Software Engineer';

      // act
      job.update({ title, actor, description: null });

      // assert
      const events = job.getUncommittedEvents() as JobUpdatedEvent[];

      expect(events[0]).toBeInstanceOf(JobUpdatedEvent);
      expect(events[0]?.title).toEqual(title);
      expect(job.getTitle()).toEqual(title);
      expect(job.getDescription()).toBeNull();
    });
  });
});
