import { Module } from '@nestjs/common';

import { KyselyDatabaseModule } from './kysley';

@Module({
  imports: [KyselyDatabaseModule],
  exports: [KyselyDatabaseModule],
})
export class DatabaseModule {}
