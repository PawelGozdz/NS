import { generateSlug } from './generate-slug';

describe('generateSlug', () => {
  it('should convert title to lowercase', () => {
    expect(generateSlug('Node Developer')).toBe('node-developer');
  });

  it('should replace spaces with hyphens', () => {
    expect(generateSlug('Node Developer')).toBe('node-developer');
  });

  it('should replace multiple spaces with a single hyphen', () => {
    expect(generateSlug('Node    Developer')).toBe('node-developer');
  });

  it('should remove leading and trailing hyphens', () => {
    expect(generateSlug(' Node Developer ')).toBe('node-developer');
  });

  it('should replace special characters with hyphens', () => {
    expect(generateSlug('Node@Developer!')).toBe('node-developer');
  });

  it('should handle empty strings', () => {
    expect(generateSlug('')).toBe('');
  });

  it('should handle strings with only special characters', () => {
    expect(generateSlug('@@@')).toBe('');
  });

  it('should handle strings with only spaces', () => {
    expect(generateSlug('   ')).toBe('');
  });

  it('should handle strings with mixed alphanumeric and special characters', () => {
    expect(generateSlug('Node Developer 123!')).toBe('node-developer-123');
  });
});
