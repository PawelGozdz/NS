import { AuthService, CookiesService } from '@app/authentication/services';
import { Controller, Get, Inject } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Controller('user')
export class UserController {
	constructor(
		private readonly logger: PinoLogger,
		@Inject(AuthService) private readonly authService: AuthService,
		@Inject(CookiesService) private readonly cookieService: CookiesService,
	) {
		this.logger.setContext(this.constructor.name);
	}
	@Get()
	findAll(): string {
		this.logger.warn({ abc: this.constructor.name }, 'Hello world!');
		return 'This action returns all userss';
	}
}
