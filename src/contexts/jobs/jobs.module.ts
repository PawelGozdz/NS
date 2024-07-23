import { Module } from '@nestjs/common';

import { SkillsModule } from './skills';
import { JobUserProfilesModule } from './user-profiles';

@Module({
  imports: [JobUserProfilesModule, SkillsModule],
  exports: [JobUserProfilesModule, SkillsModule],
})
export class JobsModule {}
