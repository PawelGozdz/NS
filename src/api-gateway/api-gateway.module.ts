import { JwtAuthenticationModule } from '@app/authentication/authentication.module';
import { AccessTokenGuard, LoggingInterceptor } from '@libs/common';
import { CqrsModule } from '@libs/cqrs';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthJwtControllerV1 } from './auth';
import { UserController } from './user.controller';

const interceptors = [
	{
		provide: APP_INTERCEPTOR,
		useClass: LoggingInterceptor,
	},
];

const providers = [];
const controllers = [UserController, AuthJwtControllerV1];
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

@Module({
	imports: [CqrsModule, JwtAuthenticationModule],
	controllers: [...controllers],
	providers: [...interceptors, ...providers, ...guards, ...pipes],
})
export class ApiGatewayModule {}
