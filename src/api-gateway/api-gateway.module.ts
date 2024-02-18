import { AuthenticationModule } from '@app/contexts/auth';
import { GlobalExceptionFilter } from '@app/core';
import { AccessTokenGuard, JsendTransformSuccessInterceptor, LoggingInterceptor } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';

import { AuthJwtControllerV1, UsersControllerV1 } from './auth';
import { CategoriesControllerV1 } from './features';
import { UserController } from './user.controller';

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: LoggingInterceptor,
	},
	{
		provide: APP_INTERCEPTOR,
		useClass: JsendTransformSuccessInterceptor,
	},
];

const exceptionFilters = [
	{
		provide: APP_FILTER,
		useClass: GlobalExceptionFilter,
	},
];

const guards = [{ provide: 'APP_GUARD', useClass: AccessTokenGuard }];
const pipes = [
	{
		provide: 'APP_PIPE',
		useFactory: () => {
			return new ValidationPipe({
				transform: true,
				whitelist: true,
			});
		},
	},
];

const controllers = [UserController, AuthJwtControllerV1, UsersControllerV1, CategoriesControllerV1];

@Module({
	imports: [CqrsModule, AuthenticationModule],
	controllers: [...controllers],
	providers: [...exceptionFilters, ...interceptors, ...guards, ...pipes],
})
export class ApiGatewayModule {}
