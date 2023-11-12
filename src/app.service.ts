import { LoggerKey } from '@core/modules/logger/domain/logger';
import LoggerService from '@core/modules/logger/domain/logger.service';
import { PinoCustomLogger } from '@core/modules/logger/infrastructure/pino/pino-logger';
import { Inject, Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
// import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AppService {
	constructor(private readonly logger: PinoLogger) {
		this.logger.setContext(this.constructor.name);
	}

	async getHello(): Promise<any> {
		this.logger.error(
			{
				foo: 'bar',
				baz: 'qux',
			},
			'ERRRRRRRRRRRRRRRRRRRRR',
		);
		// this.logger.error('I am an info message!', {
		// 	props: {
		// 		foo: 'bar',
		// 		baz: 'qux',
		// 	},
		// });
		return {
			helloWorld: 'Hello World!',
		};
	}
}
