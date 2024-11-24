import { Actor } from '@app/core';
import { ActorType, EntityId } from '@libs/common';

import { Company } from './company.aggregate-root';
import { CompanyAggregateRootFixtureFactory } from './company.aggregate-root.fixture';
import { CompanyCreatedEvent, CompanyUpdatedEvent } from './events';

describe('Company', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  const actor = Actor.create(ActorType.USER, 'handlerName', EntityId.createRandom().value);

  describe('create', () => {
    describe('Success', () => {
      it('should apply CompanyCreatedEvent with property values', () => {
        // arrange

        // act
        const entity = Company.create({
          name: 'Tesla',
          contactEmail: 'test@test.com',
          actor,
        });

        // assert
        const events = entity.getUncommittedEvents();

        expect(events.length).toEqual(1);
        expect(events[0]).toBeInstanceOf(CompanyCreatedEvent);
      });
    });
  });

  describe('update', () => {
    it('should apply CompanyUpdatedEvent with properties to be updated', () => {
      // arrange
      const entity = CompanyAggregateRootFixtureFactory.create();

      const name = 'Google';

      // act
      entity.update({ address: null, actor, name });

      // assert
      const events = entity.getUncommittedEvents() as CompanyUpdatedEvent[];

      expect(events[0]).toBeInstanceOf(CompanyUpdatedEvent);
      expect(events[0]?.address).toEqual(null);
      expect(entity.getName()).toEqual(name);
      expect(entity.getAddress()).toBeNull();
    });
  });
});
