import { AppUtils } from './app-utils';

describe('AppUtils', () => {
  describe('isTruthy', () => {
    it('should return true for truthy values', () => {
      expect(AppUtils.isTruthy(true)).toBe(true);
      expect(AppUtils.isTruthy(1)).toBe(true);
      expect(AppUtils.isTruthy('hello')).toBe(true);
      expect(AppUtils.isTruthy([1, 2, 3])).toBe(true);
      expect(AppUtils.isTruthy({ a: 1 })).toBe(true);
      expect(AppUtils.isTruthy(new Map().set('a', 1))).toBe(true);
      expect(AppUtils.isTruthy(new Set().add('a'))).toBe(true);
    });

    it('should return false for falsy values', () => {
      expect(AppUtils.isTruthy(false)).toBe(false);
      expect(AppUtils.isTruthy(0)).toBe(false);
      expect(AppUtils.isTruthy('')).toBe(false);
      expect(AppUtils.isTruthy([])).toBe(false);
      expect(AppUtils.isTruthy({})).toBe(false);
      expect(AppUtils.isTruthy(new Map())).toBe(false);
      expect(AppUtils.isTruthy(new Set())).toBe(false);
    });
  });

  describe('isFalsy', () => {
    it('should return false for truthy values', () => {
      expect(AppUtils.isFalsy(true)).toBe(false);
      expect(AppUtils.isFalsy(1)).toBe(false);
      expect(AppUtils.isFalsy('hello')).toBe(false);
      expect(AppUtils.isFalsy([1, 2, 3])).toBe(false);
      expect(AppUtils.isFalsy({ a: 1 })).toBe(false);
      expect(AppUtils.isFalsy(new Map().set('a', 1))).toBe(false);
      expect(AppUtils.isFalsy(new Set().add('a'))).toBe(false);
    });

    it('should return true for falsy values', () => {
      expect(AppUtils.isFalsy(false)).toBe(true);
      expect(AppUtils.isFalsy(0)).toBe(true);
      expect(AppUtils.isFalsy('')).toBe(true);
      expect(AppUtils.isFalsy([])).toBe(true);
      expect(AppUtils.isFalsy({})).toBe(true);
      expect(AppUtils.isFalsy(new Map())).toBe(true);
      expect(AppUtils.isFalsy(new Set())).toBe(true);
    });
  });

  describe('isEmpty', () => {
    it('should return true for empty values', () => {
      expect(AppUtils.isEmpty(false)).toBe(true);
      expect(AppUtils.isEmpty(0)).toBe(true);
      expect(AppUtils.isEmpty('')).toBe(true);
      expect(AppUtils.isEmpty([])).toBe(true);
      expect(AppUtils.isEmpty({})).toBe(true);
      expect(AppUtils.isEmpty(new Map())).toBe(true);
      expect(AppUtils.isEmpty(new Set())).toBe(true);
      expect(AppUtils.isEmpty(null)).toBe(true);
      expect(AppUtils.isEmpty(undefined)).toBe(true);
    });

    it('should return false for non-empty values', () => {
      expect(AppUtils.isEmpty(true)).toBe(false);
      expect(AppUtils.isEmpty(1)).toBe(false);
      expect(AppUtils.isEmpty('hello')).toBe(false);
      expect(AppUtils.isEmpty([1, 2, 3])).toBe(false);
      expect(AppUtils.isEmpty({ a: 1 })).toBe(false);
      expect(AppUtils.isEmpty(new Map().set('a', 1))).toBe(false);
      expect(AppUtils.isEmpty(new Set().add('a'))).toBe(false);
    });
  });

  describe('hasValue', () => {
    it('should return true for non-empty values', () => {
      expect(AppUtils.hasValue(true)).toBe(true);
      expect(AppUtils.hasValue(1)).toBe(true);
      expect(AppUtils.hasValue('hello')).toBe(true);
      expect(AppUtils.hasValue([1, 2, 3])).toBe(true);
      expect(AppUtils.hasValue({ a: 1 })).toBe(true);
      expect(AppUtils.hasValue(new Map().set('a', 1))).toBe(true);
      expect(AppUtils.hasValue(new Set().add('a'))).toBe(true);
    });

    it('should return false for empty values', () => {
      expect(AppUtils.hasValue(false)).toBe(false);
      expect(AppUtils.hasValue(0)).toBe(false);
      expect(AppUtils.hasValue('')).toBe(false);
      expect(AppUtils.hasValue([])).toBe(false);
      expect(AppUtils.hasValue({})).toBe(false);
      expect(AppUtils.hasValue(new Map())).toBe(false);
      expect(AppUtils.hasValue(new Set())).toBe(false);
      expect(AppUtils.hasValue(null)).toBe(false);
      expect(AppUtils.hasValue(undefined)).toBe(false);
    });
  });
});
