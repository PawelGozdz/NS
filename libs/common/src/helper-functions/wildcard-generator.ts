export function generateWildcardCombinations(childProperties: string[], parentProperties: string[] = []): string[] {
	let combinations: string[] = [];

	for (let child of childProperties) {
		combinations.push(child);
		combinations.push(`*.${child}`);
		combinations.push(`${child}.*`);
		combinations.push(`*.${child}.*`);
	}

	for (let parent of parentProperties) {
		for (let child of childProperties) {
			combinations.push(`${parent}.${child}`);
			combinations.push(`*.${parent}.${child}`);
			combinations.push(`${parent}.${child}.*`);
			combinations.push(`*.${parent}.${child}.*`);
		}
	}

	return combinations;
}
