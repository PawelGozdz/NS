import { RequestMethod } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Request } from 'express';
import { Params } from 'nestjs-pino';

import { mergePatch, redact } from '@libs/common';
import config, { Environment } from './app';

const isProduction = config.NODE_ENV === Environment.PRODUCTION;
const isDevelopment = config.NODE_ENV === Environment.DEVELOPMENT;

const redactPaths = [
	'password',
	'password.*.*',
	'*.password',
	'password.*',
	'*.hash',
	'hash.*',
	'email',
	'*.email',
	'email.*',
	'*.hashedRt',
	'hashedRt.*',
	'*.access_token',
	'access_token.*',
	'*.refresh_token',
	'refresh_token.*',
];

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
				const activeSpan = trace.getSpan(context.active());

				const res: { [key: string]: any } = mergePatch({ _context: object.context }, objCopy);

				const redacted = config.MASKING_ENABLED ? redact.json(res) : res;

				if (!activeSpan) {
					return redacted;
				}

				const ctx = trace.getSpan(context.active())?.spanContext();

				redacted._spanId = ctx?.spanId;
				redacted._traceId = ctx?.traceId;

				activeSpan?.addEvent(JSON.stringify(redacted));

				return redacted;
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
