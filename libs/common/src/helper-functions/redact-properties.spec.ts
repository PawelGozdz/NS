import { redact } from './redact-properties';

describe('Redact', () => {
	it('should mask email', () => {
		const result = redact.email('test@example.com');
		expect(result).toBe('te**@*********om');
	});

	it('should mask password', () => {
		const result = redact.password('password123');

		expect(result).toBe('***********');
	});

	it('should mask hash', () => {
		const result = redact.hash('1234567890abcdef');

		expect(result).toBe('123xxxxxxxxxxxxx');
	});

	it('should mask specific words in text', () => {
		const result = redact.specificWordsInText('Hello world', ['world']);

		expect(result).toBe('Hello *****');
	});

	it('should mask jwt', () => {
		const result = redact.jwt('jwt.token.here');

		expect(result).toBe('***.token.****');
	});

	it('should mask uuid', () => {
		const result = redact.uuid('123e4567-e89b-12d3-a456-426614174000');

		expect(result).toBe('123e****-****-****-****-**********00');
	});
});
