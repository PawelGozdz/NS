import { Module } from '@nestjs/common';

import { FeaturesModule } from './features';
import { JobsModule } from './jobs';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [UserManagementModule, FeaturesModule, JobsModule],
  exports: [UserManagementModule, FeaturesModule, JobsModule],
})
export class ContextModule {}
