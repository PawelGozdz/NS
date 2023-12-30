import { DomainErrorInterceptor } from '@app/core';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { UserModel } from './users';
import { UsersModule } from './users/identity.module';

const modules = [ObjectionModule.forFeature([UserModel]), UsersModule];

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: DomainErrorInterceptor,
	},
];

@Module({
	imports: [...modules],
	providers: [...interceptors],
})
export class ServicesModule {}
