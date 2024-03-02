import { AggregateRoot as AggregateRootBase } from '@libs/cqrs';

export abstract class AggregateRoot extends AggregateRootBase {
  constructor(version: number | undefined) {
    super();
    this.version = version ?? 0;
  }

  private version: number;

  getVersion() {
    return this.version;
  }

  override commit() {
    super.commit();
    this.version += 1;
  }

  abstract getId(): string | number;
}
