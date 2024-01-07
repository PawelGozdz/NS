import { Module } from '@nestjs/common';
import { UsersModule } from './auth';

const modules = [UsersModule];

const interceptors = [];

@Module({
	imports: [...modules],
	providers: [...interceptors],
})
export class ContextModule {}
