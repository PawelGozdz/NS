import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Env, Environment } from '@config/app';

@Injectable()
export class EnvService {
	constructor(private readonly configService: ConfigService<Env, true>) {}

	get<T extends keyof Env>(key: T) {
		return this.configService.get(key, { infer: true });
	}

	get isDevelopment(): boolean {
		return this.environment === Environment.DEVELOPMENT;
	}

	get isProduction(): boolean {
		return this.environment === Environment.PRODUCTION;
	}

	private get environment(): string {
		return this.configService.get<string>('NODE_ENV');
	}
}
