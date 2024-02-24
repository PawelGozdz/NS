import fs from 'fs';
import path from 'path';

function generateMigrationName(description: string = 'test2') {
	const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
	return `${timestamp}_${description}`;
}

function generateMigrationFile() {
	const description = process.argv[3];

	const migrationName = generateMigrationName(description);
	const fileName = `${migrationName}.ts`;
	const filePath = path.join(__dirname, 'migrations', fileName);

	const templatePath = path.join(__dirname, 'migrations.sub');
	const template = fs.readFileSync(templatePath, 'utf-8');

	fs.writeFileSync(filePath, template);

	console.log(`Migration file ${fileName} has been created.`);
}

generateMigrationFile();
