import dotenv from 'dotenv';

import { startApiContainer } from './api.container';
import { CONTAINER_TYPE, CONTAINERS } from './container.enum';
import { ContainerManager } from './container.manager';
import { startPostgresContainer } from './postgres.container';

dotenv.config({
  path: '.env.test-e2e',
});

export default async function setup() {
  let containerManager: ContainerManager;

  if (!globalThis.containers) {
    containerManager = new ContainerManager();
    globalThis.containers = containerManager;
    await containerManager.initNetwork();
  } else {
    containerManager = globalThis.containers;
  }

  await containerManager.addContainer(CONTAINERS.POSTGRES, startPostgresContainer, CONTAINER_TYPE.CONSTANT);
  await containerManager.addContainer(CONTAINERS.API, startApiContainer, CONTAINER_TYPE.CONSTANT, { buildImage: false });
}
