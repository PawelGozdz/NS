import config from '@config/app';
import { CqrsModule } from '@libs/cqrs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ObjectionModule } from '@willsoto/nestjs-objection';
import { AuthUserModel } from './models';
import { AuthUsersRepository, IAuthUsersRepository } from './repositories';
import { AuthService, CookiesService, HashService } from './services';
import { AuthUsersService } from './services/auth-users.service';
import { AtStrategy, RtStrategy } from './strategies';

const providers = [AuthService, JwtService, AtStrategy, RtStrategy, CookiesService, HashService, AuthUsersService];
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
		ObjectionModule.forFeature([AuthUserModel]),
	],
	providers: [...providers, ...repositories],
	exports: [...providers],
})
export class JwtAuthenticationModule {}
