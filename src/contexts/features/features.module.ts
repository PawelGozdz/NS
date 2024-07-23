import { Module } from '@nestjs/common';

import { CategoriesModule } from './categories';

@Module({
  imports: [CategoriesModule],
  exports: [CategoriesModule],
})
export class FeaturesModule {}
