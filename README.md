## Migrations

ENV file might be adjusted if docker-compose uses it.
DATABASE_HOST while container is running must be changed to 'localhost' (if is different in .env file)
DATABASE_PORT while container is running must be changed to 5432 (if is different in .env file)

Generate file

- npm run migrate:make ${some_descriptive_name}

Run all migrations

- npm run migrate

Print list of migrations

- npm run migrate:list

Rollback last batch

- npm run migrate:rollback

Revert specific name migration

- npm run migrate:down ${some_descriptive_name} (20231126140555_test55.ts -> 'test55')

## Tests

Unit tests:

- npm test

e2e test

- npm run test:e2e

e2e in watch node

- npm run test:e2e:watch
