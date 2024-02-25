import { Module } from '@nestjs/common';

import { UserController } from '@app/api-gateway/user.controller';
import { UsersModule } from './auth';
import { CategoriesModule } from './features';

const modules = [UsersModule, CategoriesModule];
const controllers = [UserController];
const interceptors = [];

@Module({
	imports: [...modules],
	providers: [...interceptors],
	exports: [...modules],
})
export class ContextModule {}
