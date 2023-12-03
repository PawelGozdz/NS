import { LoggingInterceptor } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UserController } from './user.controller';

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: LoggingInterceptor,
	},
];

const providers = [];
const controllers = [UserController];

@Module({
	imports: [CqrsModule],
	controllers: [...controllers],
	providers: [...interceptors, ...providers],
})
export class ApiGatewayModule {}
