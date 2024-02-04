import { generateWildcardCombinations } from './wildcard-generator';

describe('generateWildcardCombinations', () => {
	it('should generate correct combinations for single child and parent', () => {
		const childProperties = ['child'];
		const parentProperties = ['parent'];
		const expected = ['child', '*.child', 'child.*', '*.child.*', 'parent.child', '*.parent.child', 'parent.child.*', '*.parent.child.*'];
		expect(generateWildcardCombinations(childProperties, parentProperties)).toEqual(expected);
	});

	it('should generate correct combinations for multiple children and parents', () => {
		const childProperties = ['child1', 'child2'];
		const parentProperties = ['parent1', 'parent2'];
		const expected = [
			'child1',
			'*.child1',
			'child1.*',
			'*.child1.*',
			'child2',
			'*.child2',
			'child2.*',
			'*.child2.*',
			'parent1.child1',
			'*.parent1.child1',
			'parent1.child1.*',
			'*.parent1.child1.*',
			'parent1.child2',
			'*.parent1.child2',
			'parent1.child2.*',
			'*.parent1.child2.*',
			'parent2.child1',
			'*.parent2.child1',
			'parent2.child1.*',
			'*.parent2.child1.*',
			'parent2.child2',
			'*.parent2.child2',
			'parent2.child2.*',
			'*.parent2.child2.*',
		];
		expect(generateWildcardCombinations(childProperties, parentProperties)).toEqual(expected);
	});

	it('should generate correct combinations for children only', () => {
		const childProperties = ['child'];
		const expected = ['child', '*.child', 'child.*', '*.child.*'];
		expect(generateWildcardCombinations(childProperties)).toEqual(expected);
	});
});
