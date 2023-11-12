import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule as LM } from 'nestjs-pino';
import { Request } from 'express';

import { EnvModule } from '../../environment/infrastructure/env.module';
import { EnvService } from '../../environment/domain/env.service';

@Module({
	imports: [
		EnvModule,
		LM.forRootAsync({
			inject: [EnvService],
			useFactory: async (config: EnvService) => {
				return {
					pinoHttp: {
						autoLogging: {
							ignore: (req) => (req as Request).originalUrl === '/',
						},
						formatters: {
							log(object) {
								// Add corelationId to the object
								return object;
							},
						},
						serializers: {
							res: (response) => {
								// remove unwanted properties from response
								return response;
							},
						},
						transport: {
							targets: [
								{
									target: 'pino-pretty',
									level: config.get('LOG_LEVEL'),
									options: {
										colorize: true,
										translateTime: 'yyyy-mm-dd HH:MM:ss',
										levelFirst: true,
										messageFormat: `
											{if context} [{context}] {end} 
											{if req.method}{req.method} {end}
											{if res.statusCode}{res.statusCode} {end}
											{if req.url}{req.url} {end}
											{if req.headers.host}HOST [{req.headers.host}] {end}
											{if res.corelationId}[CorelationId - {res.corelationId}] {end}
											{if responseTime} {responseTime}ms - {end}
											{if msg} {msg} {end}
											`,
										ignore: 'hostname,pid,res,req,responseTime,context',
									},
								},
							],
						},
					},
					exclude: [{ method: RequestMethod.POST, path: 'health' }],
				};
			},
		}),
	],
})
export class LoggerModule {}
