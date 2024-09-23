import { GenericContainer, Wait } from 'testcontainers';

import { IInitFunctionProps } from './container.manager';

const localEnv = {
  POSTGRES_DB: 'e2e-test',
  POSTGRES_USER: 'test',
  POSTGRES_PASSWORD: 'test',
};

export const startPostgresContainer = async (props: IInitFunctionProps) => {
  const postgresContainer = await new GenericContainer('postgres:16')
    .withNetwork(props.network)
    .withEnvironment({
      ...localEnv,
    })
    .withExposedPorts({ host: 5432, container: 5432 })
    .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections'))
    .start();

  return postgresContainer;
};
