import { Module } from '@nestjs/common';

import { EnvService } from './environment.service';

@Module({
	providers: [EnvService],
})
export class EnvModule {}
