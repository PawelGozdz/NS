import { Category } from './category.entity';

describe('Category', () => {
  describe('constructor', () => {
    it('should create a new Category instance', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Category',
        description: 'Test description',
        parentId: 2,
        context: 'Test context',
      };

      // Act
      const category = new Category(props);

      // Assert
      expect(category.id).toBe(props.id);
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.parentId).toBe(props.parentId);
      expect(category.context).toBe(props.context);
    });

    it('should set description and parentId to null if not provided', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Category',
        context: 'Test context',
      };

      // Act
      const category = new Category(props);

      // Assert
      expect(category.description).toBeNull();
      expect(category.parentId).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new Category instance', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Category',
        description: 'Test description',
        parentId: 2,
        context: 'Test context',
      };

      // Act
      const category = Category.create(props);

      // Assert
      expect(category.id).toBe(props.id);
      expect(category.name).toBe(props.name);
      expect(category.description).toBe(props.description);
      expect(category.parentId).toBe(props.parentId);
      expect(category.context).toBe(props.context);
    });

    it('should set description and parentId to null if not provided', () => {
      // Arrange
      const props = {
        id: 1,
        name: 'Test Category',
        context: 'Test context',
      };

      // Act
      const category = Category.create(props);

      // Assert
      expect(category.description).toBeNull();
      expect(category.parentId).toBeNull();
    });
  });
});
