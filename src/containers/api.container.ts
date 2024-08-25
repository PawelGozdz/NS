import { GenericContainer, PullPolicy, StartedTestContainer, Wait } from 'testcontainers';

import { CONTAINERS } from './container.enum';
import { ContainerManager, IInitFunctionProps } from './container.manager';

const localEnv = {
  APP_NAME: process.env.APP_NAME ?? 'e2e-app',
  APP_VERSION: process.env.APP_VERSION ?? '0.0.1',
  NODE_ENV: process.env.NODE_ENV ?? 'test',
  PORT: process.env.PORT ?? '3000',
  DEBUG_PORT: process.env.DEBUG_PORT ?? '9229',
  LOG_LEVEL: process.env.LOG_LEVEL ?? 'debug',
  NODE_VERSION: process.env.NODE_VERSION ?? '18.17.1-alpine',

  DATABASE_SCHEMA: process.env.DATABASE_SCHEMA ?? 'public',
  DATABASE_NAME: process.env.DATABASE_NAME ?? 'test',
  DATABASE_USER: process.env.DATABASE_USER ?? 'test',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? 'test',

  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET ?? 'secret',
  JWT_ACCESS_TOKEN_EXPIRATION_TIME: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME ?? '2m',
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET ?? 'refreshSecret',
  JWT_REFRESH_TOKEN_EXPIRATION_TIME: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME ?? '15m',
  JAEGER_URL: process.env.JAEGER_URL ?? 'http://jaeger-e2e:4318/v1/traces',
  MASKING_ENABLED: process.env.MASKING_ENABLED ?? 'true',
  THROTTLER_TTL: process.env.THROTTLER_TTL ?? '360000',
  THROTTLER_LIMIT: process.env.THROTTLER_LIMIT ?? '500',
};

export const startApiContainer = async (props: IInitFunctionProps) => {
  const appImageName = 'huntit-api-service';

  const db = (globalThis.containers as ContainerManager).getContainer(CONTAINERS.POSTGRES) as StartedTestContainer;

  let cont: GenericContainer;

  if (props.buildImage) {
    cont = await GenericContainer.fromDockerfile(process.cwd(), 'Dockerfile')
      .withTarget('development')
      .withCache(true)
      .withPullPolicy(PullPolicy.defaultPolicy())
      .withBuildArgs({
        NODE_VERSION: localEnv.NODE_VERSION,
      })
      .build();
  } else {
    cont = new GenericContainer(appImageName);
  }

  const container = await cont
    .withNetwork(props.network)
    .withEnvironment({
      ...localEnv,
      DATABASE_LOGGING: 'false',
      DATABASE_LOGGING_LEVEL: 'query',
      DATABASE_HOST: db.getName().slice(1),
      DATABASE_PORT: db.getFirstMappedPort().toString(),
    })
    .withBindMounts([
      {
        source: `${process.cwd()}`,
        target: '/app',
        mode: 'rw',
      },
    ])
    .withExposedPorts(props.mappedPorts ?? { host: +localEnv.PORT, container: +localEnv.PORT })
    .withWaitStrategy(Wait.forLogMessage('Nest application successfully started'))
    .withCommand(['npm', 'run', 'start:dev'])
    .start();

  return container;
};
