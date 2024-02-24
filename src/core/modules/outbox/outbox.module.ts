import { DatabaseModule } from '@app/core/';
import { Global, Module } from '@nestjs/common';

import { OutboxKyselyRepository } from './outbox-kysely.repository';
import { IOutboxRepository } from './outbox-repository.interface';

const provider = {
	provide: IOutboxRepository,
	useValue: OutboxKyselyRepository,
};

@Global()
@Module({
	imports: [DatabaseModule],
	providers: [provider],
	exports: [provider],
})
export class OutboxModule {}
