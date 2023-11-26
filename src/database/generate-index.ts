import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const indexFileName = 'index.ts';

function getMigrationName(fileName: string) {
	return fileName.replace(/^\d*_/, '').replace(/(-[a-z])/g, (match) => {
		return match.substr(1).toUpperCase();
	});
}

function createIndex() {
	const files = readdirSync(join(__dirname, 'migrations'));

	const migrations = files
		.filter((filename) => filename.endsWith('.ts') && filename !== indexFileName)
		.map((fileName) => fileName.replace('.ts', ''));

	const exportLines = migrations
		.map((fileName) => ({
			from: fileName,
			migrationName: getMigrationName(fileName),
		}))
		.map(({ from, migrationName }) => `export * as ${migrationName} from './${from}';`);

	writeFileSync(join(__dirname, 'migrations', 'index.ts'), `${exportLines.join('\n')}\n`);
}

createIndex();
