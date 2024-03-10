import { IOutboxInput } from '@app/core';

import { Outbox } from './outbox.model';

export abstract class IOutboxRepository {
  abstract store(payload: IOutboxInput): Promise<void>;

  abstract findUnpublished(limit?: number): Promise<Outbox[]>;
}
