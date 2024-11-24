/* eslint-disable no-console */
import { promises as fs } from 'fs';
import { FileMigrationProvider, Kysely, Migrator } from 'kysely';
import * as path from 'path';

import { AppUtils } from '@libs/common';

import { dialect, kyselyPlugins } from './kysely.config';

async function migrateToLatest() {
  const database = new Kysely({
    dialect,
    plugins: kyselyPlugins,
  });

  const migrator = new Migrator({
    db: database,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((migrationResult) => {
    if (migrationResult.status === 'Success') {
      console.info(`migration "${migrationResult.migrationName}" was executed successfully`);
    } else if (migrationResult.status === 'Error') {
      console.error(`failed to execute migration "${migrationResult.migrationName}"`);
    }
  });

  if (AppUtils.hasValue(error)) {
    console.error('Failed to migrate');
    console.error(error);
    process.exit(1);
  }

  await database.destroy();
}

migrateToLatest();
