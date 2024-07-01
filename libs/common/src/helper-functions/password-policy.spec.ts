import { validatePassword } from './password-policy';

describe('Basic Password Policy Tests', () => {
  const basicPolicy = {
    minLength: 6,
    maxLength: 12,
    minUpperCase: 0,
    minSpecialChars: 0,
    minNumbers: 1,
    minLowerCase: 0,
    maxConcurrentNumbers: 2,
  };

  it('validates a simple numeric password', () => {
    const result = validatePassword('123456', basicPolicy);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects a password too long for basic policy', () => {
    const result = validatePassword('1234567890123', basicPolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be no more than 12 characters long.');
  });

  it('rejects a password without numbers in basic policy', () => {
    const result = validatePassword('abcdef', basicPolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 1 number(s).');
  });

  it('validates a complex password under basic policy', () => {
    const result = validatePassword('1234aA@', basicPolicy);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects a password with consecutive sequential characters under basic policy', () => {
    const result = validatePassword('1234abccc', basicPolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password should not contain more than 2 sequential or repeated characters.');
  });
});

describe('Moderate Password Policy Tests', () => {
  const moderatePolicy = {
    minLength: 8,
    maxLength: 16,
    minUpperCase: 1,
    minSpecialChars: 1,
    minNumbers: 1,
    minLowerCase: 1,
    maxConcurrentNumbers: 2,
  };

  it('validates a well-formed password under moderate policy', () => {
    const result = validatePassword('Valid1@Password', moderatePolicy);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects a password missing a special character in moderate policy', () => {
    const result = validatePassword('Valid1Password', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 1 special character(s).');
  });

  it('rejects a password missing an uppercase letter in moderate policy', () => {
    const result = validatePassword('valid1@password', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 1 uppercase letter(s).');
  });

  it('rejects a password too short for moderate policy', () => {
    const result = validatePassword('V1@p', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 8 characters long.');
  });

  it('rejects a password without uppercase letters in moderate policy', () => {
    const result = validatePassword('valid1@password', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 1 uppercase letter(s).');
  });

  it('rejects a password without special characters in moderate policy', () => {
    const result = validatePassword('Valid1Password', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 1 special character(s).');
  });

  it('rejects a password too long for moderate policy', () => {
    const result = validatePassword('Valid1@PasswordTooLongForPolicy', moderatePolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be no more than 16 characters long.');
  });
});

describe('Strict Password Policy Tests', () => {
  const strictPolicy = {
    minLength: 12,
    maxLength: 24,
    minUpperCase: 2,
    minSpecialChars: 2,
    minNumbers: 2,
    minLowerCase: 2,
  };

  it('validates a complex password under strict policy', () => {
    const result = validatePassword('2Valid#7Passwords!Aa', strictPolicy);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('rejects a password for being too short in strict policy', () => {
    const result = validatePassword('Shrt2#Aa', strictPolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 12 characters long.');
  });

  it('rejects a password for not having enough uppercase letters in strict policy', () => {
    const result = validatePassword('onlyoneuppercase1#Aa', strictPolicy);
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least 2 uppercase letter(s).');
  });
});
