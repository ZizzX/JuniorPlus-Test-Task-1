export type LogLevel =
	| 'fatal'
	| 'error'
	| 'warn'
	| 'info'
	| 'debug'
	| 'trace'
	| 'silent';

export interface LoggerContext {
	[key: string]: unknown;
}

export interface ILogger {
	fatal(msg: unknown, meta?: LoggerContext): void;
	error(msg: unknown, meta?: LoggerContext): void;
	warn(msg: unknown, meta?: LoggerContext): void;
	info(msg: unknown, meta?: LoggerContext): void;
	debug(msg: unknown, meta?: LoggerContext): void;
	trace(msg: unknown, meta?: LoggerContext): void;
}
