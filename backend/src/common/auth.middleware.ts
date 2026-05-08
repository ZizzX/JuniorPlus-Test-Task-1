import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { injectable } from 'inversify';
import { verify } from 'jsonwebtoken';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(private secret: string) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		if (req.headers.authorization) {
			const token = req.headers.authorization.split(' ')[1];
			verify(token, this.secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload !== 'string') {
					req.token = payload.email;
					next();
				}
			});
		} else {
			next();
		}
	}
}
