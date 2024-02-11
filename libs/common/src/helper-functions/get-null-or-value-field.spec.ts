import { getNullOrValueField } from './get-null-or-value-field';

describe('getNullOrValueField', () => {
	it('should return null when field is null', () => {
		const result = getNullOrValueField(null, 'original');
		expect(result).toBeNull();
	});

	it('should return originalField when field is undefined', () => {
		const result = getNullOrValueField(undefined, 'original');
		expect(result).toBe('original');
	});

	it('should return field when field is not null or undefined', () => {
		const result = getNullOrValueField('field', 'original');
		expect(result).toBe('field');
	});

	it('should return undefined when both field and originalField are undefined', () => {
		const result = getNullOrValueField(undefined, undefined);
		expect(result).toBeUndefined();
	});
});
