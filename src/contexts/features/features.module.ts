import { Module } from '@nestjs/common';

import { CategoriesModule } from './categories';
import { SkillsModule } from './skills';

@Module({
  imports: [CategoriesModule, SkillsModule],
  exports: [CategoriesModule, SkillsModule],
})
export class FeaturesModule {}
