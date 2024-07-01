interface PasswordPolicy {
  minUpperCase?: number;
  minSpecialChars?: number;
  minNumbers?: number;
  minLowerCase?: number;
  minLength?: number;
  maxLength?: number;
  maxConcurrentNumbers?: number;
}

interface PasswordPolicyResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string, policy: PasswordPolicy): PasswordPolicyResult {
  const errors: string[] = [];
  const upperCaseMatches = password.match(/[A-Z]/g) ?? [];
  const specialCharMatches = password.match(/[^A-Za-z0-9]/g) ?? [];
  const numberMatches = password.match(/[0-9]/g) ?? [];
  const lowerCaseMatches = password.match(/[a-z]/g) ?? [];
  const maxConcurrentChars = policy.maxConcurrentNumbers ?? 3;
  const repeatedCharsRegex = new RegExp(`(.)\\1{${maxConcurrentChars},}`, 'g');

  if (policy.minLength && password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long.`);
  }

  if (policy.maxLength && password.length > policy.maxLength) {
    errors.push(`Password must be no more than ${policy.maxLength} characters long.`);
  }

  if (policy.minUpperCase && upperCaseMatches.length < policy.minUpperCase) {
    errors.push(`Password must contain at least ${policy.minUpperCase} uppercase letter(s).`);
  }

  if (policy.minSpecialChars && specialCharMatches.length < policy.minSpecialChars) {
    errors.push(`Password must contain at least ${policy.minSpecialChars} special character(s).`);
  }

  if (policy.minNumbers && numberMatches.length < policy.minNumbers) {
    errors.push(`Password must contain at least ${policy.minNumbers} number(s).`);
  }

  if (policy.minLowerCase && lowerCaseMatches.length < policy.minLowerCase) {
    errors.push(`Password must contain at least ${policy.minLowerCase} lowercase letter(s).`);
  }

  if (repeatedCharsRegex.test(password)) {
    errors.push(`Password should not contain more than ${maxConcurrentChars} sequential or repeated characters.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
