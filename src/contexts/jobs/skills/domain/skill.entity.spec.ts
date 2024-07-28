import { Skill } from './skill.entity';

describe('Skill', () => {
  const categoryId = 3;

  describe('constructor', () => {
    it('should create a new Skill instance', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Skill',
        description: 'Test description',
        categoryId,
      };

      // Act
      const skill = new Skill(props);

      // Assert
      expect(skill.id).toBe(props.id);
      expect(skill.name).toBe(props.name);
      expect(skill.description).toBe(props.description);
    });
  });

  describe('create', () => {
    it('should create a new Skill instance', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Skill',
        description: 'Test description',
        categoryId,
      };

      // Act
      const skill = Skill.create(props);

      // Assert
      expect(skill.id).toBe(props.id);
      expect(skill.name).toBe(props.name);
      expect(skill.description).toBe(props.description);
    });

    it('should set description to null if not provided', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Skill',
        categoryId,
      };

      // Act
      const skill = Skill.create(props);

      // Assert
      expect(skill.description).toBeNull();
    });
  });
});
