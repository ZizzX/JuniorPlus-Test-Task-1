import { NextFunction, Request, Response } from 'express';
import { ILogger } from '../logger/logger.interface';
import { IExceptionFilter } from './exception.filter.interface';
import { HttpError } from './http-error.class';

export class ExceptionFilter implements IExceptionFilter {
	constructor(private logger: ILogger) {}

	catch(
		err: Error | HttpError,
		req: Request,
		res: Response,
		next: NextFunction
	): void {
		if (err instanceof HttpError) {
			this.logger.error(
				`[${err.context}] Error ${err.statusCode}: ${err.message}`
			);
			res.status(err.statusCode).json({ error: err.message });
		} else {
			this.logger.error(`Error: ${err.message}`);
			res.status(500).json({ error: 'Internal Server Error' });
		}
	}
}
