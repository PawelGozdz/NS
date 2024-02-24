export function getCoalescedField<T>(field: T | null | undefined, originalField: T | undefined): T | undefined {
	if (field === null) {
		return undefined;
	}

	if (field === undefined) {
		return originalField;
	}

	return field;
}
