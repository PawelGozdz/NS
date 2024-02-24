/* eslint-disable @typescript-eslint/ban-ts-comment */
import { mergePatch } from './merge-patch';

describe('merge patch', () => {
	it('should overwrite target with undefined', () => {
		// act
		const result = mergePatch({ a: 1 }, undefined);

		// assert
		expect(result).toEqual(undefined);
	});

	it('should overwrite target with null', () => {
		// act
		const result = mergePatch({ a: 1 }, null);

		// assert
		expect(result).toEqual(null);
	});

	it('should report TS error on unknown properties', () => {
		// act
		// @ts-expect-error
		const result = mergePatch({ a: 1 }, { b: 2 });

		// assert
		expect(result).toEqual({ a: 1, b: 2 });
	});

	it('should merge known properties', () => {
		// act
		const result = mergePatch({ a: 1 }, { a: 2 });

		// assert
		expect(result).toEqual({ a: 2 });
	});

	it('should clear optional property', () => {
		// arrange
		type A = { a?: number };
		const target: A = { a: 1 };

		// act
		const result = mergePatch(target, { a: null });

		// assert
		expect(result).toEqual({});
	});

	it('should report TS error when trying to clear required property', () => {
		// arrange
		type A = { a: number };
		const target: A = { a: 1 };

		// act
		// @ts-expect-error
		const result = mergePatch(target, { a: null });

		// assert
		expect(result).toEqual({});
	});

	it('should ignore property with value undefined', () => {
		// arrange
		type A = { a?: number };
		const target: A = { a: 1 };

		// act
		const result = mergePatch(target, { a: undefined });

		// assert
		expect(result).toEqual({ a: 1 });
	});

	it('should merge nested objects', () => {
		// arrange
		const target = { a: { b: 1, c: 2 } };

		// act
		const result = mergePatch(target, { a: { c: 3 } });

		// assert
		expect(result).toEqual({ a: { b: 1, c: 3 } });
	});

	it('should report TS error for nested properties', () => {
		// arrange
		const target = { a: { b: 1, c: 2 } };

		// act
		// @ts-expect-error
		const result = mergePatch(target, { a: { c: null } });

		// assert
		expect(result).toEqual({ a: { b: 1 } });
	});

	it('should clear nested properties', () => {
		// arrange
		type A = { a: { b: number; c?: number } };
		const target: A = { a: { b: 1, c: 2 } };

		// act
		const result = mergePatch(target, { a: { c: null } });

		// assert
		expect(result).toEqual({ a: { b: 1 } });
	});
});
