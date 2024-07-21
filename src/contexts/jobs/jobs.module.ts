import { Module } from '@nestjs/common';

import { JobUserProfilesModule } from './user-profiles';

@Module({
  imports: [JobUserProfilesModule],
  exports: [JobUserProfilesModule],
})
export class JobsModule {}
