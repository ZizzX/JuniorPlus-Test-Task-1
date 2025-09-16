import pino, { Logger as PinoLogger, LoggerOptions } from 'pino';
import { randomUUID } from 'crypto';

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

export interface LoggerServiceOptions {
  level?: LogLevel;
  pretty?: boolean;
  base?: Record<string, unknown>;
}

export class LoggerService {
  private readonly logger: PinoLogger;

  constructor(options: LoggerServiceOptions = {}) {
    const isProd = process.env.NODE_ENV === 'production';

    const baseOptions: LoggerOptions = {
      level: options.level || (isProd ? 'info' : 'debug'),
      base: {
        service: process.env.npm_package_name || 'backend',
        env: process.env.NODE_ENV || 'development',
        ...options.base,
      },
    };

    const transport =
      !isProd || options.pretty
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'yyyy-mm-dd HH:MM:ss.l o',
              singleLine: false,
            },
          }
        : undefined;

    this.logger = pino({ ...baseOptions, transport });
  }

  child(context: LoggerContext): LoggerService {
    const child = this.logger.child(context);
    const instance = Object.create(LoggerService.prototype) as LoggerService;
    (instance as any).logger = child;
    return instance;
  }

  withRequestId(requestId?: string): LoggerService {
    return this.child({ requestId: requestId || randomUUID() });
  }

  fatal(msg: unknown, meta?: LoggerContext) {
    this.logger.fatal(meta ?? {}, msg as any);
  }

  error(msg: unknown, meta?: LoggerContext) {
    this.logger.error(meta ?? {}, msg as any);
  }

  warn(msg: unknown, meta?: LoggerContext) {
    this.logger.warn(meta ?? {}, msg as any);
  }

  info(msg: unknown, meta?: LoggerContext) {
    this.logger.info(meta ?? {}, msg as any);
  }

  debug(msg: unknown, meta?: LoggerContext) {
    this.logger.debug(meta ?? {}, msg as any);
  }

  trace(msg: unknown, meta?: LoggerContext) {
    this.logger.trace(meta ?? {}, msg as any);
  }
}

export const logger = new LoggerService();
