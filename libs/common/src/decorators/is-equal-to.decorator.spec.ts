import { catchActError } from '@libs/testing';
import { validate } from 'class-validator';
import { IsEqualTo } from './is-equal-to.decorator';

class TestClass {
	@IsEqualTo('propertyToMatch')
	property: string;

	propertyToMatch: string;
}

describe('IsEqualTo', () => {
	let testClass: TestClass;

	beforeEach(() => {
		testClass = new TestClass();
	});

	it('should not return any errors if the properties are equal', async () => {
		// Arrange
		testClass.property = 'test';
		testClass.propertyToMatch = 'test';

		// Act
		const errors = await validate(testClass);

		expect(errors).toHaveLength(0);
	});

	it('should return an error if the properties are not equal', async () => {
		// Arrange
		testClass.property = 'test';
		testClass.propertyToMatch = 'different';

		// Act
		const errors = await catchActError(() => validate(testClass));

		expect(errors.result).toHaveLength(1);
		expect(errors.result![0].constraints).toEqual({
			isEqualTo: 'property must match propertyToMatch exactly',
		});
	});
});
