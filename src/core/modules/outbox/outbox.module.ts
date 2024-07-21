import { Global, Module } from '@nestjs/common';

import { DatabaseModule } from '@app/core/';

import { OutboxKyselyRepository } from './outbox-kysely.repository';
import { IOutboxRepository } from './outbox-repository.interface';

const provider = {
  provide: IOutboxRepository,
  useClass: OutboxKyselyRepository,
};

@Global()
@Module({
  imports: [DatabaseModule],
  providers: [provider],
  exports: [provider],
})
export class OutboxModule {}
