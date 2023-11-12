import * as winston from 'winston';
import { Inject, Injectable, RequestMethod } from '@nestjs/common';
import pino, { TransportMultiOptions, TransportTargetOptions } from 'pino';
import ILogger from '../../domain/logger';
import { LogData, LogLevel } from '../../domain/logger.interfaces';
import { EnvService } from '@core/modules/environment/domain/env.service';
import { PinoLogger as PLogger } from 'nestjs-pino';
import { Request } from 'express';
import { PinoLoggerTransportsKey } from './shared.config';

@Injectable()
export class PinoCustomLogger implements ILogger {
	private logger: PLogger;

	public constructor(@Inject(PinoLoggerTransportsKey) transports: TransportTargetOptions[]) {
		this.logger = this.setDefaultInitializer(transports);
	}

	private setDefaultInitializer(transports: TransportTargetOptions[]) {
		const levels: any = {};
		let cont = 0;
		Object.values(LogLevel).forEach((level) => {
			levels[level] = cont;
			cont++;
		});

		return new PLogger({
			pinoHttp: {
				customLevels: levels,
				autoLogging: {
					ignore: (req) => (req as Request).originalUrl === '/',
				},
				formatters: {
					log(object) {
						// Add corelationId to the object
						// console.log(object.res);
						console.log(object);
						return object;
					},
				},
				serializers: {
					res: (response) => {
						console.log('RESPONSE \n');
						// remove unwanted properties from response
						return response;
					},
				},

				// customProps: (req, res) => ({
				// 	context: 'HTTP',
				// 	else: 555,
				// }),
				transport: {
					targets: transports,
				},
			},
			exclude: [{ method: RequestMethod.POST, path: 'health' }],
		});
	}

	public log(level: LogLevel, message: string | Error, data?: LogData, profile?: string) {
		const logData = {
			level: level,
			message: message instanceof Error ? message.message : message,
			error: message instanceof Error ? message : undefined,
			...data,
		};

		this.logger.info(logData);
	}

	public debug(message: string, data?: LogData, profile?: string) {
		this.log(LogLevel.Debug, message, data, profile);
	}

	public info(message: string, data?: LogData, profile?: string) {
		this.log(LogLevel.Info, message, data, profile);
	}

	public warn(message: string | Error, data?: LogData, profile?: string) {
		this.log(LogLevel.Warn, message, data, profile);
	}

	public error(message: string | Error, data?: LogData, profile?: string) {
		this.log(LogLevel.Error, message, data, profile);
	}

	public fatal(message: string | Error, data?: LogData, profile?: string) {
		this.log(LogLevel.Fatal, message, data, profile);
	}

	public emergency(message: string | Error, data?: LogData, profile?: string) {
		this.log(LogLevel.Emergency, message, data, profile);
	}
}

// return {
//     level: LogLevel.Debug,
//     levels: levels,
//     format: winston.format.combine(
//       // Add timestamp and format the date
//       winston.format.timestamp({
//         format: 'DD/MM/YYYY, HH:mm:ss',
//       }),
//       // Errors will be logged with stack trace
//       winston.format.errors({ stack: true }),
//       // Add custom Log fields to the log
//       winston.format((info, opts) => {
//         // Info contains an Error property
//         if (info.error && info.error instanceof Error) {
//           info.stack = info.error.stack;
//           info.error = undefined;
//         }

//         info.label = `${info.organization}.${info.context}.${info.app}`;

//         return info;
//       })(),
//       // Add custom fields to the data property
//       winston.format.metadata({
//         key: 'data',
//         fillExcept: ['timestamp', 'level', 'message'],
//       }),
//       // Format the log as JSON
//       winston.format.json(),
//     ),
//     transports: transports,
//     exceptionHandlers: transports,
//     rejectionHandlers: transports,
//   };
