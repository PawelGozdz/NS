import { Module } from '@nestjs/common';

import { UsersModule } from './auth';
import { CategoriesModule } from './features';

const modules = [UsersModule, CategoriesModule];

const interceptors = [];

@Module({
	imports: [...modules],
	providers: [...interceptors],
})
export class ContextModule {}
