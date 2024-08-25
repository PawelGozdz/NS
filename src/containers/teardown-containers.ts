/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTAINER_TYPE } from './container.enum';

const globalTeardown = async (config: any) => {
  console.log('\nTearing down containers');

  if (!globalThis.containers) {
    return;
  }

  if (config.watch || config.watchAll) {
    await globalThis.containers.removeByType(CONTAINER_TYPE.DYNAMIC);
    return;
  }

  await globalThis.containers.removeAllContainers();

  console.log('\nTearing down containers completed');
};

export default globalTeardown;
