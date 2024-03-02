import { v4 as uuidV4 } from 'uuid';

type UUID = 'v4';

export class AppUtils {
  static getUUID(type?: UUID) {
    if (type === 'v4') {
      return uuidV4();
    }

    return uuidV4();
  }

  static isEmpty(input: unknown): boolean {
    return !this.isTruthy(input);
  }

  static hasValue(input: unknown): boolean {
    return this.isTruthy(input);
  }

  static isNotEmpty(input: unknown): boolean {
    return this.isTruthy(input);
  }

  static isTruthy(input: unknown): boolean {
    if (typeof input === 'boolean') {
      return input;
    }
    if (typeof input === 'number') {
      return input !== 0 && !Number.isNaN(input);
    }
    if (typeof input === 'string') {
      return input.length > 0;
    }
    if (input === null || input === undefined) {
      return false;
    }

    if (input instanceof Map) {
      return input.size > 0;
    }
    if (input instanceof Set) {
      return input.size > 0;
    }

    if (typeof input === 'object') {
      if (Array.isArray(input)) {
        return input.length > 0;
      }
      if (input instanceof Date) {
        return !Number.isNaN(input.getTime());
      }
      return Object.keys(input).length > 0;
    }

    return false;
  }

  static isFalsy(input: unknown): boolean {
    return !this.isTruthy(input);
  }
}
