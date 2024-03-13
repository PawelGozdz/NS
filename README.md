## Bootstrap

Application starts in docker, initializing database, service and jeager
`docker-compose up`

Application is available on:

- [localhost:3000/api/v1/](localhost:3000/api/v1/)

Jeager logs

- [localhost:16686](http://localhost:16686/)

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

## Generating new ADR

Is described in [this article](docs/adr.md)

## Dependency Cruiser

- `sudo apt install graphviz` - some errors might occure, if so run:
  - `sudo do-release-upgrade` - updated whole distribution
  - `sudo apt-get update`

Then run `sudo apt install graphviz`

Generating graph:

- npx depcruise src --include-only "^src" --output-type dot | dot -T svg > ./dependency-graphs/dependency-graph.svg

## Git pre-hooks

Skip running Husky

`git commit -m "intitial commit" --no-verify`

### Running Husky scripts

By default Husky runs on each `git commit`
It runs eslint and prettier. After that commit message prompt pops up and message validation at the very end.

## Commit Message Format

Each commit message must adhere to the following format:

Where:

- The short description is a brief summary of the changes the commit introduces. It should be written in present tense.
- `(HI-XXXX)` is the JIRA ticket number associated with the commit. Replace `XXXX` with the actual ticket number. This should be placed at the end of the commit message.

For example: `Add new feature to component (HI-1234)`