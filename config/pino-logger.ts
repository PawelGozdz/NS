import { RequestMethod } from '@nestjs/common';
import { Request } from 'express';
import { Params } from 'nestjs-pino';
import config, { Environment } from './app';

const isProduction = config.NODE_ENV === Environment.PRODUCTION;

const options: Params = {
	pinoHttp: {
		autoLogging: isProduction
			? {
					ignore: (req) => (req as Request).originalUrl === '/',
			  }
			: false,
		formatters: isProduction
			? {
					log(object) {
						// Add corelationId to the object
						return object;
					},
			  }
			: undefined,
		serializers: isProduction
			? {
					res: (response) => {
						// remove unwanted properties from response
						return response;
					},
			  }
			: undefined,
		transport: isProduction
			? undefined
			: {
					targets: [
						{
							target: 'pino-pretty',
							level: config.LOG_LEVEL || 'info',
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
