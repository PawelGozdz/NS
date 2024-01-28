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
		formatters: {
			log(object) {
				const objCopy = { ...object };
				delete objCopy.context;

				return {
					props: Object.keys(objCopy).length > 0 ? objCopy : undefined,
					context: object.context,
				};
			},
		},
		transport: {
			targets: [
				{
					target: 'pino-pretty',
					level: config.LOG_LEVEL || 'info',
					options: {
						colorize: true,
						translateTime: 'yyyy-mm-dd HH:MM:ss',
						levelFirst: true,

						ignore: 'hostname,pid,res,req,responseTime',
					},
				},
			],
		},
	},
	exclude: [{ method: RequestMethod.POST, path: 'health' }],
};

export default options;
