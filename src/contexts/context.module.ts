import { Module } from '@nestjs/common';

import { FeaturesModule } from './features';
import { JobsModule } from './jobs';
import { OrganizationModule } from './organizations';
import { UserManagementModule } from './user-management';

@Module({
  imports: [UserManagementModule, FeaturesModule, JobsModule, OrganizationModule],
  exports: [UserManagementModule, FeaturesModule, JobsModule, OrganizationModule],
})
export class ContextModule {}
