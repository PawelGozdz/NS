import maskdata from 'maskdata';

class Redact {
	private emailMask2Options = {
		maskWith: '*',
		unmaskedStartCharactersBeforeAt: 2,
		unmaskedEndCharactersAfterAt: 2,
		maskAtTheRate: false,
	};

	private jwtMaskOptions = {
		maskWith: '*',
		maxMaskedCharacters: 512,
		maskDot: false,
		maskHeader: true,
		maskPayload: false,
		maskSignature: true,
	};

	private maskPasswordOptions = {
		maskWith: '*',
		maxMaskedCharacters: 40,
		unmaskedStartCharacters: 0,
		unmaskedEndCharacters: 0,
	};

	private stringMaskV2Options = {
		maskWith: 'x',
		maxMaskedCharacters: 20,
		unmaskedStartCharacters: 3,
		unmaskedEndCharacters: 0,
	};

	private maskStringOptions = {
		maskWith: '*',
		maskOnlyFirstOccurance: false,
		maskAll: false,
		maskSpace: true,
	};

	private jsonMaskConfig = {
		stringMaskOptions: { maskWith: '*', maskOnlyFirstOccurance: false, values: [], maskAll: true, maskSpace: false },
		stringFields: [],
	};

	private maskUuidOptions = {
		maskWith: '*',
		unmaskedStartCharacters: 4,
		unmaskedEndCharacters: 2,
	};

	public email(email: string) {
		return maskdata.maskEmail2(email, this.emailMask2Options);
	}

	public password(password: string) {
		return maskdata.maskPassword(password, this.maskPasswordOptions);
	}

	public hash(hash: string) {
		return maskdata.maskStringV2(hash, this.stringMaskV2Options);
	}

	public specificWordsInText(text: string, words: string[]) {
		return maskdata.maskString(text, { ...this.maskStringOptions, values: words });
	}

	public uuid(uuid: string) {
		return maskdata.maskUuid(uuid, this.maskUuidOptions);
	}

	public jwt(jwt: string) {
		return maskdata.maskJwt(jwt, this.jwtMaskOptions);
	}

	public nestedObject(obj: Record<string, any>, stringFields: string[] = []) {
		const fields = stringFields.length > 0 ? stringFields : Object.keys(obj);

		return maskdata.maskJSON2(obj, { ...this.jsonMaskConfig, stringFields: fields });
	}

	redact(prop: string, value: string) {
		if (prop === 'password') {
			return this.password(value);
		} else if (prop === 'hash') {
			return this.hash(value);
		} else if (prop === 'email') {
			return this.email(value);
		} else if (prop === 'hashedRt') {
			return this.hash(value);
		} else if (prop === 'access_token') {
			return this.jwt(value);
		} else if (prop === 'refresh_token') {
			return this.jwt(value);
		}
		return value;
	}
}

export const redact = new Redact();
