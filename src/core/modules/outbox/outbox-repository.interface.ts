import { IOutbox, IOutboxInput } from './types';

export abstract class IOutboxRepository {
	abstract store(payload: IOutboxInput): Promise<void>;
	abstract findUnpublished(limit?: number): Promise<IOutbox[]>;
}
