/* eslint-disable import/no-extraneous-dependencies */
import { RequestMethod } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Request } from 'express';
import { Params } from 'nestjs-pino';

import { AppUtils, mergePatch, redact } from '@libs/common';

import { Environment, appConfig } from './app';

const isProduction = appConfig.NODE_ENV === Environment.PRODUCTION;

const options: Params = {
  pinoHttp: {
    autoLogging: isProduction ? { ignore: (req) => (req as Request).originalUrl === '/' } : false,
    formatters: {
      log(object) {
        const objCopy = { ...object };

        delete objCopy.context;
        const activeSpan = trace.getSpan(context.active());

        const res: { [key: string]: unknown } = mergePatch({ __context: object.context }, objCopy);

        const redacted = appConfig.MASKING_ENABLED ? redact.json(res) : res;

        if (AppUtils.isEmpty(activeSpan)) {
          return redacted;
        }

        if ('__context' in redacted) {
          const ctx = trace.getSpan(context.active())?.spanContext();

          redacted.__spanId = ctx?.spanId;
          redacted.__traceId = ctx?.traceId;

          activeSpan?.addEvent(JSON.stringify(redacted));
        }

        return redacted;
      },
    },
    transport: {
      targets: [
        {
          target: 'pino-pretty',
          level: appConfig.LOG_LEVEL ?? 'info',
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
