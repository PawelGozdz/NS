import config from '@app/config/app';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';

import { OnUserUpdatedHandler } from './events';
import { AuthUsersRepository, IAuthUsersRepository } from './repositories';
import { AuthService, AuthUsersService, CookiesService, HashService } from './services';
import { AtStrategy, RtStrategy } from './strategies';

const providers = [AuthService, JwtService, AtStrategy, RtStrategy, CookiesService, HashService, AuthUsersService];
const handlers = [OnUserUpdatedHandler];
const repositories = [
	{
		provide: IAuthUsersRepository,
		useClass: AuthUsersRepository,
	},
];

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async () => ({
				isGlobal: true,
				secret: config.JWT_ACCESS_TOKEN_SECRET,
				signOptions: {
					expiresIn: config.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
				},
			}),
		}),
		CqrsModule,
	],
	providers: [...providers, ...handlers, ...repositories],
	exports: [...providers],
})
export class AuthenticationModule {}
