import { Module } from '@nestjs/common';

import { FeaturesModule } from './features';
import { UserManagementModule } from './user-management/user-management.module';

@Module({
  imports: [UserManagementModule, FeaturesModule],
  exports: [UserManagementModule, FeaturesModule],
})
export class ContextModule {}
