export function generateWildcardCombinations(childProperties: string[], parentProperties: string[] = []): string[] {
  const combinations: string[] = [];

  for (const child of childProperties) {
    combinations.push(child);
    combinations.push(`*.${child}`);
    combinations.push(`${child}.*`);
    combinations.push(`*.${child}.*`);
  }

  for (const parent of parentProperties) {
    for (const child of childProperties) {
      combinations.push(`${parent}.${child}`);
      combinations.push(`*.${parent}.${child}`);
      combinations.push(`${parent}.${child}.*`);
      combinations.push(`*.${parent}.${child}.*`);
    }
  }

  return combinations;
}
