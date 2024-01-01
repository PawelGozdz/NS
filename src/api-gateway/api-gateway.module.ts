import { JwtAuthenticationModule } from '@app/authentication/authentication.module';
import { GlobalExceptionFilter } from '@app/core';
import { AccessTokenGuard, LoggingInterceptor } from '@libs/common';
import { JsendTransformSuccessInterceptor } from '@libs/common/interceptors/jsend-transform.interceptor';
import { CqrsModule } from '@libs/cqrs';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthJwtControllerV1 } from './auth';
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

const controllers = [UserController, AuthJwtControllerV1];

@Module({
	imports: [CqrsModule, JwtAuthenticationModule],
	controllers: [...controllers],
	providers: [...exceptionFilters, ...interceptors, ...guards, ...pipes],
})
export class ApiGatewayModule {}
