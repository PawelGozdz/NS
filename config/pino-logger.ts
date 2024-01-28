import { RequestMethod } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
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
				const activeSpan = trace.getSpan(context.active());

				if (!activeSpan) {
					return objCopy;
				}

				delete objCopy.context;

				const ctx = trace.getSpan(context.active())?.spanContext();

				const res = {
					props: Object.keys(objCopy).length > 0 ? objCopy : undefined,
					context: object.context,
					spanId: ctx?.spanId,
					traceId: ctx?.traceId,
				};

				activeSpan?.addEvent(JSON.stringify(res));

				return res;
			},
		},
		redact: {
			paths: ['user.password', 'password', 'props.password', '*.password'],
			censor: '[REDACTED]',
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
