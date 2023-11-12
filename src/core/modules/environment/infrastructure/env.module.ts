import { Global, Module } from '@nestjs/common';
import { EnvService } from '../domain/env.service';
import { ConfigModule } from '@nestjs/config';
import { envSchema } from '@config/app/environment';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validate: (env) => envSchema.parse(env),
		}),
		EnvModule,
	],
	providers: [EnvService],
	exports: [EnvService],
})
export class EnvModule {}
