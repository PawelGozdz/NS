import { Module } from '@nestjs/common';
import { UsersModule } from './identity/identity.module';

const modules = [UsersModule];
const interceptors = [];

@Module({
	imports: [...modules],
	providers: [...interceptors],
})
export class ServicesModule {}
