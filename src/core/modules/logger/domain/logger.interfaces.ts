export enum LogLevel {
	Emergency = 'emergency', // One or more systems are unusable.
	Fatal = 'fatal', // A person must take an action immediately
	Error = 'error', // Error events are likely to cause problems
	Warn = 'warn', // Warning events might cause problems in the future and deserve eyes
	Info = 'info', // Routine information, such as ongoing status or performance
	Debug = 'debug', // Debug or trace information
}

export interface Log {
	timestamp: number; // Unix timestamp
	level: LogLevel; // Log level
	message: string; // Log message
	data: LogData; // Log data
}

export interface LogData {
	organization?: string; // Organization or project name
	context?: string; // Bounded Context name
	app?: string; // Application or Microservice name
	sourceClass?: string; // Classname of the source
	correlationId?: string; // Correlation ID
	error?: Error; // Error object
	props?: NodeJS.Dict<any>; // Additional custom properties
}

enum LogColors {
	red = '\x1b[31m',
	green = '\x1b[32m',
	yellow = '\x1b[33m',
	blue = '\x1b[34m',
	magenta = '\x1b[35m',
	cyan = '\x1b[36m',
	pink = '\x1b[38;5;206m',
}

export const colorize = (color: LogColors, message: string): string => {
	return `${color}${message}\x1b[0m`;
};

export const mapLogLevelColor = (level: LogLevel): LogColors => {
	switch (level) {
		case LogLevel.Debug:
			return LogColors.blue;
		case LogLevel.Info:
			return LogColors.green;
		case LogLevel.Warn:
			return LogColors.yellow;
		case LogLevel.Error:
			return LogColors.red;
		case LogLevel.Fatal:
			return LogColors.magenta;
		case LogLevel.Emergency:
			return LogColors.pink;
		default:
			return LogColors.cyan;
	}
};
