import { redact } from './redact-properties';
import { generateWildcardCombinations } from './wildcard-generator';

describe('Redact', () => {
	it('should have correct defaultjsonMask2Configs', () => {
		const redactInstance = redact;

		const configs = redactInstance.defaultjsonMask2Configs;

		expect(configs.emailMaskOptions).toEqual({
			maskWith: '*',
			unmaskedStartCharactersBeforeAt: 2,
			unmaskedEndCharactersAfterAt: 3,
			maskAtTheRate: false,
		});
		expect(configs.emailFields).toEqual(generateWildcardCombinations(['email'], ['dto', 'user', 'event']));

		expect(configs.passwordMaskOptions).toEqual({
			maskWith: '*',
			maxMaskedCharacters: 16,
			unmaskedStartCharacters: 0,
			unmaskedEndCharacters: 0,
		});
		expect(configs.passwordFields).toEqual(generateWildcardCombinations(['password'], ['dto', 'user', 'event']));

		expect(configs.uuidMaskOptions).toEqual({
			maskWith: '*',
			unmaskedStartCharacters: 0,
			unmaskedEndCharacters: 0,
		});
		expect(configs.uuidFields).toEqual([]);

		expect(configs.jwtMaskOptions).toEqual({
			maskWith: '*',
			maxMaskedCharacters: 512,
			maskDot: true,
			maskHeader: true,
			maskPayload: true,
			maskSignature: true,
		});
		expect(configs.jwtFields).toEqual(generateWildcardCombinations(['access_token', 'refresh_token']));

		expect(configs.genericStrings).toEqual([
			{
				config: {
					maskWith: '*',
					maxMaskedCharacters: 256,
					unmaskedStartCharacters: 3,
					unmaskedEndCharacters: 2,
				},
				fields: generateWildcardCombinations(['hash', 'hashedRt'], ['dto', 'user', 'event']),
			},
		]);
	});
});
