export function getNullOrValueField<T>(field: T | null | undefined, originalField: T | null): T | null {
	if (field === null) {
		return null;
	}

	if (field === undefined) {
		return originalField;
	}

	return field;
}
