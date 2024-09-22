import { EntityId, generateSlug } from '@libs/common';

import { JobPositionEntityFixtureFactory } from './job-position-entity.fixture';
import { JobPosition } from './job-position.entity';
import { JobPositionSnapshot } from './job-position.snapshot';

describe('JobPosition', () => {
  const categoryId = 3;
  const id = EntityId.createRandom();

  const props = {
    id,
    title: 'Test JobPosition',
    skillIds: [1, 2, 5],
    categoryId,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create a new JobPosition instance', () => {
      // Arrange

      // Act
      const skill = new JobPosition({
        ...props,
        slug: generateSlug(props.title),
      });

      // Assert
      expect(skill).toEqual({
        ...props,
        slug: generateSlug(props.title),
      });
    });
  });

  describe('create', () => {
    it('should create a new jobPosition instance', () => {
      // Arrange

      // Act
      const jp = JobPosition.create({
        categoryId: 3,
        title: 'Test JobPosition',
        skillIds: [],
      });

      // Assert
      expect(jp.id).toEqual(expect.any(EntityId));
    });
  });

  describe('addSkill', () => {
    it('should add a new skill', () => {
      // Arrange
      const skillId = 222;
      const jobPosition = JobPositionEntityFixtureFactory.create(props);

      // Act
      jobPosition.addSkill(skillId);

      // Assert
      expect(jobPosition.skillIds.length).toBe(4);
    });
  });

  describe('removeSkill', () => {
    it('should remove skill', () => {
      // Arrange
      const skillId = 1;
      const jobPosition = JobPositionEntityFixtureFactory.create(props);

      // Act
      jobPosition.removeSkill(skillId);

      // Assert
      expect(jobPosition.skillIds).toEqual([2, 5]);
    });
  });

  describe('restoreFromSnapshot', () => {
    it('should restore a JobPosition from a snapshot', () => {
      // Arrange
      const snapshot: JobPositionSnapshot = {
        id: props.id.value,
        title: props.title,
        slug: generateSlug(props.title),
        categoryId: props.categoryId,
        skillIds: props.skillIds,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Act
      const jobPosition = JobPosition.restoreFromSnapshot(snapshot);

      // Assert
      expect(jobPosition).toEqual({
        id: props.id,
        title: props.title,
        slug: generateSlug(props.title),
        categoryId: props.categoryId,
        skillIds: props.skillIds,
      });
    });
  });
});
