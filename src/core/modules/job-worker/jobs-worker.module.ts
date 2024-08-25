import { Module } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';

import { JobManagerService } from './job-manager.service';
import { PgBossProvider } from './pg-boss.provider';

@Module({
  imports: [DiscoveryModule],
  providers: [JobManagerService, PgBossProvider],
  exports: [JobManagerService],
})
export class JobWorkerModule {}
