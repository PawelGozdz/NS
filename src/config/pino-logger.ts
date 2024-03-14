/* eslint-disable import/no-extraneous-dependencies */
import { RequestMethod } from '@nestjs/common';
import { context, trace } from '@opentelemetry/api';
import { Params } from 'nestjs-pino';

import { AppUtils, redact } from '@libs/common';

import { appConfig } from './app';

type LogResponseObj = {
  metadata: {
    _ctx: string;
    _traceId?: string;
    _spanId?: string;
  };
  props?: { [key: string]: unknown };
  err?: { message: string; stack?: unknown; [key: string]: unknown };
};

const options: Params = {
  renameContext: '_ctx',
  pinoHttp: {
    autoLogging: false,
    formatters: {
      log(object) {
        if (AppUtils.isEmpty(object)) {
          return object;
        }

        const { _ctx, err, ...rest } = object;

        const activeSpan = trace.getSpan(context.active());

        const res: LogResponseObj = {
          metadata: {
            _ctx: _ctx as string,
          },
        };

        if (AppUtils.isNotEmpty(rest)) {
          res.props = rest;
        }

        const redacted = (appConfig.MASKING_ENABLED ? redact.json(res) : res) as LogResponseObj;

        if (AppUtils.isEmpty(activeSpan)) {
          return redacted;
        }

        if (err instanceof Error) {
          redacted.err = {
            ...err,
            message: err.message,
            stack: err.stack,
          };
        } else if (AppUtils.isNotEmpty(err) && typeof err === 'object') {
          const error = err as Record<string, unknown>;
          redacted.err = {
            ...err,
            message: AppUtils.isNotEmpty(error.message) ? (error.message as string) : 'Unknown error',
          };
        }

        if ('_ctx' in redacted.metadata) {
          const ctx = trace.getSpan(context.active())?.spanContext();

          redacted.metadata._spanId = ctx?.spanId;
          redacted.metadata._traceId = ctx?.traceId;

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
