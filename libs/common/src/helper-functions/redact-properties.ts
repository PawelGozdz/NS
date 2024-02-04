import maskdata from 'maskdata';
import { generateWildcardCombinations } from './wildcard-generator';

class Redact {
	defaultjsonMask2Configs = {
		emailMaskOptions: {
			maskWith: '*',
			unmaskedStartCharactersBeforeAt: 2,
			unmaskedEndCharactersAfterAt: 3,
			maskAtTheRate: false,
		},
		emailFields: generateWildcardCombinations(['email'], ['dto', 'user', 'event']),

		passwordMaskOptions: {
			maskWith: '*',
			maxMaskedCharacters: 16,
			unmaskedStartCharacters: 0,
			unmaskedEndCharacters: 0,
		},
		passwordFields: generateWildcardCombinations(['password'], ['dto', 'user', 'event']),

		uuidMaskOptions: {
			maskWith: '*',
			unmaskedStartCharacters: 0,
			unmaskedEndCharacters: 0,
		},
		uuidFields: [],

		jwtMaskOptions: {
			maskWith: '*',
			maxMaskedCharacters: 512,
			maskDot: true,
			maskHeader: true,
			maskPayload: true,
			maskSignature: true,
		},
		jwtFields: generateWildcardCombinations(['access_token', 'refresh_token']),

		genericStrings: [
			{
				config: {
					maskWith: '*',
					maxMaskedCharacters: 256,
					unmaskedStartCharacters: 3,
					unmaskedEndCharacters: 2,
				},
				fields: generateWildcardCombinations(['hash', 'hashedRt'], ['dto', 'user', 'event']),
			},
		],
	};

	public json(obj: Record<string, any>) {
		return maskdata.maskJSON2(obj, this.defaultjsonMask2Configs);
	}
}

export const redact = new Redact();
