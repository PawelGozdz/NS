import { Network, PortWithOptionalBinding, StartedNetwork, StartedTestContainer } from 'testcontainers';

import { CONTAINER_TYPE } from './container.enum';

interface ICont {
  container: StartedTestContainer;
  type: CONTAINER_TYPE;
}

export interface IInitFunctionProps {
  serviceName: string;
  network: StartedNetwork;
  buildImage?: boolean;
  options?: Record<string, unknown>;
  mappedPorts?: PortWithOptionalBinding;
}

export class ContainerManager {
  private readonly containers: Map<string, ICont>;

  private network: StartedNetwork;

  constructor() {
    this.containers = new Map();
  }

  async initNetwork() {
    this.network = await new Network().start();
  }

  async addContainer(
    name: string,
    initFunction: Function,
    type: CONTAINER_TYPE,
    options: Record<string, unknown> = {},
  ): Promise<StartedTestContainer> {
    if (this.containers.has(name)) {
      return this.getContainer(name) as StartedTestContainer;
    }
    const container = (await initFunction({
      serviceName: name,
      ...options,
      network: this.network,
    })) as StartedTestContainer;

    console.log(
      `****${name.toUpperCase()} has container started on${container?.getName().slice(1) ? ` (${container?.getName().slice(1)})` : ''}: ${container?.getHost()}:${container?.getFirstMappedPort()}\n`,
    );

    this.containers.set(name, { container, type });

    return container;
  }

  getContainer(name: string): StartedTestContainer | null {
    const containerInfo = this.containers.get(name);

    return containerInfo ? containerInfo.container : null;
  }

  async removeAllContainers() {
    for await (const [key, cont] of this.containers) {
      await cont.container.stop();
      this.containers.delete(key);
    }
  }

  async removeByType(type: CONTAINER_TYPE) {
    for await (const [key, cont] of this.containers) {
      if (cont.type === type) {
        await cont.container.stop();
        this.containers.delete(key);
      }
    }
  }

  async removeByName(name: string) {
    const containerInfo = this.getContainer(name);

    if (containerInfo) {
      await containerInfo.stop();
      this.containers.delete(name);
    }
  }

  async changeContainerStatus(name: string, newStatus: CONTAINER_TYPE) {
    const containerInfo = this.getContainer(name);

    if (containerInfo) {
      this.containers.set(name, { container: containerInfo, type: newStatus });
    }
  }

  getContainerType(name: string): CONTAINER_TYPE | null {
    const containerInfo = this.containers.get(name);

    return containerInfo ? containerInfo.type : null;
  }
}
