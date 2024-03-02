import { getCoalescedField } from './get-coalesced-field';

describe('getCoalescedField', () => {
  it('should return undefined if field is null', () => {
    // Arrange
    const field = null;
    const originalField = 'original value';

    // Act
    const result = getCoalescedField(field, originalField);

    // Assert
    expect(result).toBeUndefined();
  });

  it('should return originalField if field is undefined', () => {
    // Arrange
    const field = undefined;
    const originalField = 'original value';

    // Act
    const result = getCoalescedField(field, originalField);

    // Assert
    expect(result).toBe(originalField);
  });

  it('should return field if field is not null or undefined', () => {
    // Arrange
    const field = 'field value';
    const originalField = 'original value';

    // Act
    const result = getCoalescedField(field, originalField);

    // Assert
    expect(result).toBe(field);
  });
});
