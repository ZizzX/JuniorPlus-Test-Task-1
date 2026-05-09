import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { verify, Secret } from 'jsonwebtoken';
import { TYPES } from './inject.constants';
import { IConfigService } from '../config/config.service.interface';

@injectable()
export class AuthMiddleware implements IMiddleware {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService
	) {}

	execute(req: Request, res: Response, next: NextFunction): void {
		const authHeader = req.headers.authorization;
		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.split(' ')[1];
			const secret = this.configService.get('SECRET') as string;
			
			verify(token, secret as Secret, (err, payload) => {
				if (err) {
					next();
				} else if (payload && typeof payload !== 'string') {
					req.userEmail = (payload as any).email;
					next();
				} else {
					next();
				}
			});
		} else {
			next();
		}
	}
}
