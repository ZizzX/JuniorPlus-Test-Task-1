import { NextFunction, Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILogger } from '../logger/logger.interface';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http-error.class';
import { TYPES } from '../common/inject.constants';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private logger: ILogger) {}

	catch(
		err: Error | HttpError,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		const isProd = process.env.NODE_ENV === 'production';

		if (err instanceof HttpError) {
			this.logger.error(
				`[${err.context}] Error ${err.statusCode}: ${err.message}`,
				{ stack: err.stack }
			);
			res.status(err.statusCode).json({
				error: err.message,
				context: !isProd ? err.context : undefined,
			});
		} else {
			this.logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
			
			res.status(500).json({
				error: 'Internal Server Error',
				// Never leak stack trace in production
				message: !isProd ? err.message : 'Something went wrong',
				stack: !isProd ? err.stack : undefined,
			});
		}
	}
}
