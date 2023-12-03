import { Controller, Get } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';

@Controller('user')
export class UserController {
	constructor(private readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}
	@Get()
	findAll(): string {
		this.logger.warn({ abc: this.constructor.name }, 'Hello world!');
		return 'This action returns all userss';
	}
}
