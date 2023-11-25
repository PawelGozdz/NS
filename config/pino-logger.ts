import { RequestMethod } from '@nestjs/common';
import config from './app';
import { Request } from 'express';
import { Params } from 'nestjs-pino';

const options: Params = {
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
					level: 'info',
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

export default options;
// export default registerAs<Params>('pino', () => options);
